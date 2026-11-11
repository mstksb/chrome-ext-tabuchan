(() => {
  if (globalThis.__mruPageInput) return;

  const guard = { ready: false };
  globalThis.__mruPageInput = guard;
  let pressState = globalThis.MruPressState.create();
  const modifiers = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
  const frameId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const closedPressIds = new Set();
  let shortcuts = null;
  let holdDelayMs = 1000;
  let maxPastTabs = 10;
  let currentPress = null;
  let pressCounter = 0;
  let holdTimer;
  let configVersion = 0;
  let pickerUi = null;

  async function send(message) {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch {
      return null;
    }
  }

  function displayMessage(action, press) {
    return {
      type: "mru-picker-display",
      action,
      pressId: press.id,
      items: press.picker?.items || [],
      selectedIndex: press.picker?.selectedIndex ?? -1,
      mode: press.picker?.mode || press.mode,
      query: press.picker?.query || "",
    };
  }

  function cancelPress({ restoreFocus = false } = {}) {
    clearTimeout(holdTimer);
    pressState.cancel();
    const cancelled = currentPress;
    currentPress = null;
    if (cancelled) {
      cancelled.cancelled = true;
      return send(displayMessage("hide", cancelled)).then((response) => {
        if (restoreFocus && response?.ok && cancelled.focusTransferred && currentPress === null
          && document.visibilityState !== "hidden" && document.hasFocus()
          && cancelled.previousFocus?.isConnected) {
          cancelled.previousFocus.focus({ preventScroll: true });
        }
        return response;
      });
    }
    return Promise.resolve();
  }

  function disableInput() {
    guard.ready = false;
    shortcuts = null;
    cancelPress({ restoreFocus: true });
    if (pickerUi) hidePickerUi(pickerUi.pressId);
  }

  function ensureExtensionContext() {
    try {
      const extensionId = chrome.runtime?.id;
      if (extensionId) return extensionId;
    } catch {
      // Chrome can invalidate an existing content script after an extension reload.
    }
    configVersion += 1;
    disableInput();
    return null;
  }

  function isBinding(value) {
    return value && typeof value.code === "string" && value.code.length > 0
      && modifiers.every((modifier) => typeof value[modifier] === "boolean");
  }

  function isBindingList(value) {
    return Array.isArray(value) && value.length > 0 && value.every(isBinding);
  }

  async function refreshConfig() {
    if (!ensureExtensionContext()) return;
    const version = ++configVersion;
    disableInput();
    const response = await send({ type: "mru-config" });
    if (version !== configVersion || !ensureExtensionContext()) return;
    if (response?.ok && isBindingList(response.shortcuts?.back) && isBindingList(response.shortcuts?.forward)) {
      shortcuts = response.shortcuts;
      holdDelayMs = Number.isInteger(response.holdDelayMs)
        && response.holdDelayMs >= 500 && response.holdDelayMs <= 2000
        && response.holdDelayMs % 100 === 0 ? response.holdDelayMs : 1000;
      maxPastTabs = Number.isInteger(response.maxPastTabs)
        && response.maxPastTabs >= 10 && response.maxPastTabs <= 30 ? response.maxPastTabs : 10;
      pressState = globalThis.MruPressState.create(holdDelayMs);
      guard.ready = true;
    }
  }

  function matches(event, binding) {
    return event.code === binding.code
      && modifiers.every((modifier) => event[modifier] === binding[modifier]);
  }

  function consume(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function displayPicker(action, press) {
    press.displayQueue = press.displayQueue.then(async () => {
      if (currentPress !== press || press.cancelled) return;
      if (!ensureExtensionContext()) return;
      const response = await send(displayMessage(action, press));
      if (!response?.ok && currentPress === press) disableInput();
    });
  }

  async function openPicker(press, mode = "mru") {
    if (currentPress !== press || press.cancelled) return;
    press.openRequested = true;
    press.mode = mode;
    press.loading = true;
    const requestVersion = ++press.requestVersion;
    const response = await send({ type: "mru-list", direction: press.direction, mode, pressId: press.id });
    if (currentPress !== press || press.cancelled || requestVersion !== press.requestVersion) return;
    if (response === null) {
      disableInput();
      return;
    }
    if (!response.ok || !Array.isArray(response.items)
      || (mode === "mru" && response.items.length > maxPastTabs)
      || !Number.isInteger(response.selectedIndex)
      || (response.items.length === 0 ? response.selectedIndex !== -1
        : response.selectedIndex < 0 || response.selectedIndex >= response.items.length)
      || !Number.isInteger(response.generation) || !Number.isInteger(response.sourceTabId)
      || !response.items.every((item) => Number.isInteger(item.tabId))) {
      cancelPress();
      return;
    }
    press.picker = {
      mode,
      query: "",
      allItems: response.items,
      items: response.items,
      selectedIndex: response.selectedIndex,
      generation: response.generation,
      sourceTabId: response.sourceTabId,
    };
    if (mode === "tabs") press.focusTransferred = true;
    press.loading = false;
    displayPicker(press.displayed ? "update" : "show", press);
    press.displayed = true;
  }

  async function moveOnce(direction) {
    const response = await send({ type: "mru-move", direction });
    if (response === null) disableInput();
  }

  function applyPressAction(action, press) {
    if (!action || currentPress !== press) return;
    if (action.type === "list") {
      void openPicker(press);
    } else if (action.type === "tap") {
      currentPress = null;
      void moveOnce(action.direction);
    }
  }

  function startPress(direction, binding) {
    const now = performance.now();
    if (!pressState.start(direction, now)) return;
    const press = {
      id: `${frameId}-${++pressCounter}`,
      direction,
      binding,
      cancelled: false,
      openRequested: false,
      mode: "mru",
      loading: false,
      displayed: false,
      requestVersion: 0,
      focusTransferred: false,
      previousFocus: document.activeElement,
      picker: null,
      displayQueue: Promise.resolve(),
    };
    currentPress = press;
    holdTimer = setTimeout(() => {
      if (currentPress === press && !press.cancelled && ensureExtensionContext()) {
        applyPressAction(pressState.hold(performance.now()), press);
      }
    }, holdDelayMs);
  }

  async function selectItem(press) {
    const { items, selectedIndex, generation, sourceTabId, mode } = press.picker;
    const targetTabId = items[selectedIndex]?.tabId;
    if (!Number.isInteger(targetTabId)) return;
    await cancelPress({ restoreFocus: true });
    const response = await send({
      type: "mru-select",
      selection: { generation, sourceTabId, targetTabId, mode },
    });
    if (response === null) disableInput();
  }

  function filterPicker(press, query) {
    const picker = press.picker;
    const selectedTabId = picker.items[picker.selectedIndex]?.tabId;
    picker.query = query;
    const normalizedQuery = query.normalize("NFC").toLowerCase();
    picker.items = picker.allItems.filter((item) => String(item.title || "").normalize("NFC").toLowerCase().includes(normalizedQuery));
    const previousIndex = picker.items.findIndex((item) => item.tabId === selectedTabId);
    picker.selectedIndex = previousIndex >= 0 ? previousIndex : picker.items.length > 0 ? 0 : -1;
    displayPicker("update", press);
  }

  function handlePickerKey(event) {
    const press = currentPress;
    if (!press?.openRequested) return false;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"].includes(event.code)) {
      if (press.mode === "tabs") {
        consume(event);
        return true;
      }
      return false;
    }
    consume(event);
    if (event.code === "Escape") {
      if (!event.repeat) cancelPress({ restoreFocus: true });
      return true;
    }
    if (event.code === "Enter") {
      if (!event.repeat && !press.loading && press.picker) void selectItem(press);
      return true;
    }
    if (event.code === "ArrowRight") return true;
    if (event.code === "ArrowLeft") {
      if (!event.repeat && !press.loading) void openPicker(press, press.mode === "mru" ? "tabs" : "mru");
      return true;
    }
    if (press.loading || !press.picker) return true;
    if (press.picker.items.length > 0) {
      const change = event.code === "ArrowUp" ? -1 : 1;
      const next = Math.max(0, Math.min(press.picker.items.length - 1, press.picker.selectedIndex + change));
      if (next !== press.picker.selectedIndex) {
        press.picker.selectedIndex = next;
        displayPicker("update", press);
      }
    }
    return true;
  }

  function applyPickerControl(message) {
    const press = currentPress;
    if (!press || press.id !== message.pressId || press.cancelled || !press.openRequested) return false;
    if (message.action === "cancel") {
      void cancelPress();
      return true;
    }
    if (message.action === "search") {
      if (typeof message.query !== "string") return false;
      if (press.mode !== "tabs" || press.loading || !press.picker) return true;
      filterPicker(press, message.query);
      return true;
    }
    if (message.action !== "key") return false;
    return handlePickerKey({
      code: message.code,
      repeat: message.repeat === true,
      preventDefault() {},
      stopImmediatePropagation() {},
    });
  }

  function sendPickerControl(ui, action, details = {}) {
    if (ui.closing || pickerUi !== ui) return;
    if (!ensureExtensionContext()) return;
    const message = {
      type: "mru-picker-input", pressId: ui.pressId, sourceFrameId: ui.sourceFrameId, action, ...details,
    };
    ui.controlQueue = ui.controlQueue.then(async () => {
      if (action !== "cancel" && (ui.closing || pickerUi !== ui)) return;
      if (!ensureExtensionContext()) return;
      const response = ui.sourceFrameId === 0 && currentPress?.id === ui.pressId
        ? { ok: applyPickerControl(message) } : await send(message);
      if (!response?.ok && pickerUi === ui) hidePickerUi(ui.pressId);
    });
  }

  function pickerInputFocused() {
    return Boolean(pickerUi && pickerUi.shadow.activeElement === pickerUi.searchInput);
  }

  function handlePickerUiKey(event) {
    const ui = pickerUi;
    if (!ui || !pickerInputFocused()) return false;
    if (ui.composing || event.isComposing || event.keyCode === 229) {
      event.stopImmediatePropagation();
      return true;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"].includes(event.code)) {
      consume(event);
      sendPickerControl(ui, "key", { code: event.code, repeat: event.repeat === true });
      return true;
    }
    event.stopImmediatePropagation();
    return true;
  }

  window.addEventListener("keydown", (event) => {
    if (!event.isTrusted) return;
    if (!ensureExtensionContext()) return;
    if (handlePickerUiKey(event)) return;
    if (!guard.ready || event.isComposing) return;
    if (handlePickerKey(event)) return;
    const direction = shortcuts.back.some((binding) => matches(event, binding)) ? "back"
      : shortcuts.forward.some((binding) => matches(event, binding)) ? "forward" : null;
    if (!direction) return;
    consume(event);
    if (!event.repeat && currentPress === null) {
      startPress(direction, shortcuts[direction].find((binding) => matches(event, binding)));
    }
  }, true);

  window.addEventListener("keyup", (event) => {
    if (!event.isTrusted || !ensureExtensionContext()) return;
    if (pickerInputFocused()) {
      event.stopImmediatePropagation();
      return;
    }
    if (!currentPress) return;
    const press = currentPress;
    const requiredReleased = event.code === press.binding.code
      || modifiers.some((modifier) => press.binding[modifier] && !event[modifier]);
    if (!requiredReleased) return;
    consume(event);
    clearTimeout(holdTimer);
    applyPressAction(pressState.release(performance.now()), press);
  }, true);

  window.addEventListener("blur", () => {
    if (pickerUi) {
      const ui = pickerUi;
      ui.restoreFocus = false;
      sendPickerControl(ui, "cancel");
      hidePickerUi(ui.pressId);
    }
    if (!currentPress?.focusTransferred) void cancelPress();
  });
  window.addEventListener("focus", () => {
    if (!ensureExtensionContext()) return;
    if (!guard.ready) void refreshConfig();
  });
  window.addEventListener("pagehide", cancelPress);
  document.addEventListener("visibilitychange", () => {
    if (!ensureExtensionContext()) return;
    if (document.visibilityState === "hidden") cancelPress();
    else if (!guard.ready) void refreshConfig();
  });

  function rememberClosed(pressId) {
    closedPressIds.add(pressId);
    if (closedPressIds.size > 64) closedPressIds.delete(closedPressIds.values().next().value);
  }

  function hidePickerUi(pressId) {
    rememberClosed(pressId);
    if (pickerUi?.pressId === pressId) {
      const ui = pickerUi;
      pickerUi = null;
      ui.closing = true;
      ui.host.remove();
      if (ui.restoreFocus && document.visibilityState !== "hidden" && document.hasFocus()
        && ui.previousFocus?.isConnected) {
        ui.previousFocus.focus({ preventScroll: true });
      }
    }
  }

  function iconUrl(value) {
    if (typeof value !== "string" || value.length === 0) return null;
    if (/^data:image\/(?:png|gif|jpeg|webp|avif|svg\+xml|x-icon|vnd\.microsoft\.icon)[;,]/i.test(value)) return value;
    try {
      const url = new URL(value);
      if (["http:", "https:", "chrome-extension:"].includes(url.protocol)) return url.href;
      if (url.protocol === "chrome:" && url.hostname === "favicon2") return url.href;
    } catch {
      return null;
    }
    return null;
  }

  function createIcon(value) {
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");
    const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    fallback.setAttribute("viewBox", "0 0 24 24");
    fallback.setAttribute("fill", "none");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M8 5h10a2 2 0 0 1 2 2v10M6 8h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z");
    path.setAttribute("stroke", "#527bc6");
    path.setAttribute("stroke-width", "1.7");
    fallback.append(path);
    icon.append(fallback);
    const source = iconUrl(value);
    if (source) {
      const image = document.createElement("img");
      image.alt = "";
      image.referrerPolicy = "no-referrer";
      image.hidden = true;
      image.onload = () => {
        image.hidden = false;
        fallback.setAttribute("hidden", "");
      };
      image.onerror = () => {
        image.hidden = true;
        fallback.removeAttribute("hidden");
      };
      image.src = source;
      icon.append(image);
    }
    return icon;
  }

  function createPickerUi(pressId) {
    const host = document.createElement("div");
    host.id = "mru-tab-switcher-picker";
    for (const [property, value] of Object.entries({
      all: "initial", position: "fixed", top: "24px", left: "50%",
      transform: "translateX(-50%)", width: "min(520px, calc(100vw - 32px))",
      "z-index": "2147483647", "pointer-events": "none", "color-scheme": "light",
    })) host.style.setProperty(property, value, "important");
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      [hidden] { display: none !important; }
      .picker { overflow: hidden; border: 1px solid #c9d8ed; border-top: 3px solid #3869d4;
        border-radius: 14px; background: #fff; color: #17243b;
        box-shadow: 0 12px 40px #12233d35; font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .heading { display: flex; justify-content: space-between; align-items: center; padding: 15px 18px 11px; gap: 12px; }
      .heading strong { font-size: 13px; font-weight: 650; }
      .counter { color: #526783; font-size: 12px; font-variant-numeric: tabular-nums; }
      .list { position: relative; max-height: min(60vh, 480px); overflow-y: auto; margin: 0 8px; padding: 2px 0; }
      .row { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 8px 10px;
        border: 1px solid transparent; border-radius: 8px; }
      .row[aria-selected="true"] { border-color: #bfd0f2; background: #edf3ff; }
      .group { margin: 5px 0; padding-left: 12px; border-left: 2px solid #a3b5ce; }
      .group-title { padding: 4px 10px; color: #526783; font-size: 12px; font-weight: 650; }
      .search { padding: 0 18px 9px; color: #526783; font-size: 12px; }
      .search-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }
      .search-input { display: block; width: 100%; padding: 8px 10px; border: 1px solid #b8c9e2;
        border-radius: 7px; background: #fff; color: #17243b; font: inherit; pointer-events: auto; }
      .search-input:focus { outline: 2px solid #3869d4; outline-offset: 1px; }
      .empty { padding: 18px 10px; color: #526783; }
      .icon { display: grid; place-items: center; flex: 0 0 26px; width: 26px; height: 26px; }
      img, svg { width: 22px; height: 22px; }
      .item-body { flex: 1; min-width: 0; }
      .item-title { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .unavailable { display: block; margin-top: 2px; color: #596579; font-size: 11px; overflow-wrap: anywhere; }
      .hint { padding: 12px 18px 14px; color: #526783; font-size: 11px; }
      .announcement { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
      @media (prefers-color-scheme: dark) {
        .picker { background: #172236; color: #f0f4fc; border-color: #3c5273; border-top-color: #85a9ff; }
        .row[aria-selected="true"] { border-color: #5677b1; background: #263b5d; }
        .counter, .hint, .group-title, .search, .empty { color: #bbcae0; }
        .unavailable { color: #c6d0df; }
        .search-input { background: #1d2b43; color: #f0f4fc; border-color: #718098; }
      }
    `;
    const card = document.createElement("div");
    card.className = "picker";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", chrome.i18n.getMessage("picker_select_label", [
      chrome.i18n.getMessage("picker_recent_tabs"),
    ]));
    const heading = document.createElement("div");
    heading.className = "heading";
    const label = document.createElement("strong");
    label.textContent = chrome.i18n.getMessage("picker_recent_tabs");
    const counter = document.createElement("span");
    counter.className = "counter";
    heading.append(label, counter);
    const search = document.createElement("div");
    search.className = "search";
    search.dataset.query = "";
    const searchInput = document.createElement("input");
    searchInput.id = "search-input";
    searchInput.className = "search-input";
    searchInput.type = "text";
    searchInput.placeholder = chrome.i18n.getMessage("picker_search_placeholder");
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;
    searchInput.setAttribute("aria-label", chrome.i18n.getMessage("picker_search_label"));
    search.append(searchInput);
    const list = document.createElement("div");
    list.className = "list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", chrome.i18n.getMessage("picker_candidates_label"));
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = chrome.i18n.getMessage("picker_controls");
    const announcement = document.createElement("div");
    announcement.className = "announcement";
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    card.append(heading, search, list, hint, announcement);
    shadow.append(style, card);
    document.documentElement.append(host);
    const ui = {
      pressId, host, shadow, card, label, search, searchInput, list, rows: [], counter, announcement,
      itemKey: null, mode: "mru", sourceFrameId: 0, composing: false, ownsFocus: false,
      previousFocus: document.activeElement, restoreFocus: false, closing: false, pendingQuery: null,
      controlQueue: Promise.resolve(),
    };
    function submitQuery() {
      if (ui.composing || ui.mode !== "tabs" || ui.pendingQuery === searchInput.value) return;
      ui.pendingQuery = searchInput.value;
      sendPickerControl(ui, "search", { query: searchInput.value });
    }
    searchInput.addEventListener("compositionstart", (event) => {
      if (!ensureExtensionContext()) return;
      event.stopPropagation();
      ui.composing = true;
    });
    searchInput.addEventListener("compositionend", (event) => {
      if (!ensureExtensionContext()) return;
      event.stopPropagation();
      ui.composing = false;
      submitQuery();
    });
    searchInput.addEventListener("input", (event) => {
      if (!event.isTrusted) return;
      if (!ensureExtensionContext()) return;
      event.stopPropagation();
      if (!event.isComposing) submitQuery();
    });
    searchInput.addEventListener("blur", () => {
      if (ui.closing || pickerUi !== ui) return;
      ui.restoreFocus = false;
      sendPickerControl(ui, "cancel");
      hidePickerUi(ui.pressId);
    });
    return ui;
  }

  function renderPickerItems(items, mode) {
    const { list } = pickerUi;
    list.replaceChildren();
    let previousGroupId = null;
    let groupContainer = null;
    const rows = [];
    for (const [index, item] of items.entries()) {
      let container = list;
      const grouped = mode === "tabs" && Number.isInteger(item.groupId) && item.groupId >= 0;
      if (grouped) {
        if (previousGroupId !== item.groupId) {
          groupContainer = document.createElement("div");
          groupContainer.className = "group";
          groupContainer.dataset.groupId = String(item.groupId);
          groupContainer.setAttribute("role", "group");
          const groupTitle = typeof item.group?.title === "string" && item.group.title.trim()
            ? item.group.title : chrome.i18n.getMessage("picker_unnamed_group");
          groupContainer.setAttribute("aria-label", groupTitle);
          const heading = document.createElement("div");
          heading.className = "group-title";
          heading.textContent = groupTitle;
          groupContainer.append(heading);
          list.append(groupContainer);
        }
        container = groupContainer;
      }
      previousGroupId = grouped ? item.groupId : null;
      const row = document.createElement("div");
      row.className = "row";
      row.id = `mru-picker-option-${index}`;
      row.dataset.tabId = String(item.tabId);
      row.setAttribute("role", "option");
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = typeof item.title === "string" && item.title.trim()
        ? item.title : chrome.i18n.getMessage("picker_untitled");
      title.title = title.textContent;
      const body = document.createElement("span");
      body.className = "item-body";
      body.append(title);
      row.append(createIcon(item.favIconUrl), body);
      if (item.inputAvailable === false) {
        const marker = document.createElement("span");
        marker.className = "unavailable";
        marker.textContent = chrome.i18n.getMessage("picker_unavailable");
        marker.title = chrome.i18n.getMessage("picker_unavailable_hint");
        body.append(marker);
      }
      container.append(row);
      rows.push(row);
    }
    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = chrome.i18n.getMessage(mode === "tabs" ? "picker_no_matches" : "picker_no_history");
      list.append(empty);
    }
    pickerUi.rows = rows;
  }

  function updatePickerUi(message) {
    const mode = message.mode === "tabs" ? "tabs" : "mru";
    const query = mode === "tabs" && typeof message.query === "string" ? message.query : "";
    const itemKey = JSON.stringify([mode, query, message.items]);
    if (pickerUi.itemKey !== itemKey) {
      renderPickerItems(message.items, mode);
      pickerUi.itemKey = itemKey;
    }
    pickerUi.host.dataset.mode = mode;
    pickerUi.label.textContent = chrome.i18n.getMessage(mode === "tabs" ? "picker_tab_list" : "picker_recent_tabs");
    pickerUi.card.setAttribute("aria-label", chrome.i18n.getMessage("picker_select_label", [pickerUi.label.textContent]));
    const modeChanged = pickerUi.mode !== mode;
    pickerUi.mode = mode;
    pickerUi.sourceFrameId = Number.isInteger(message.sourceFrameId) ? message.sourceFrameId : 0;
    pickerUi.search.className = mode === "tabs" ? "search" : "search search-hidden";
    pickerUi.searchInput.readOnly = mode !== "tabs";
    pickerUi.search.dataset.query = query;
    if (modeChanged) {
      pickerUi.searchInput.value = query;
      pickerUi.pendingQuery = query;
    }
    if (mode === "tabs" && !pickerUi.ownsFocus) {
      pickerUi.ownsFocus = true;
      pickerUi.restoreFocus = true;
      pickerUi.searchInput.focus({ preventScroll: true });
    }
    const { rows, list } = pickerUi;
    if (rows.length === 0) {
      list.removeAttribute("aria-activedescendant");
      pickerUi.counter.textContent = chrome.i18n.getMessage("picker_position", ["0", "0"]);
      pickerUi.announcement.textContent = chrome.i18n.getMessage("picker_no_candidates");
      return;
    }
    if (!Number.isInteger(message.selectedIndex) || message.selectedIndex < 0
      || message.selectedIndex >= rows.length) return;
    for (const [index, row] of rows.entries()) {
      row.setAttribute("aria-selected", String(index === message.selectedIndex));
    }
    const selected = rows[message.selectedIndex];
    list.setAttribute("aria-activedescendant", selected.id);
    pickerUi.counter.textContent = chrome.i18n.getMessage("picker_position", [
      String(message.selectedIndex + 1), String(rows.length),
    ]);
    pickerUi.announcement.textContent = selected.textContent;
    if (selected.offsetTop < list.scrollTop) list.scrollTop = selected.offsetTop;
    else if (selected.offsetTop + selected.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = selected.offsetTop + selected.offsetHeight - list.clientHeight;
    }
  }

  function receivePickerUi(message) {
    if (window !== window.top || typeof message.pressId !== "string") return;
    if (message.action === "hide") {
      hidePickerUi(message.pressId);
      return;
    }
    if (document.visibilityState === "hidden") {
      rememberClosed(message.pressId);
      return;
    }
    if (closedPressIds.has(message.pressId) || !document.documentElement) return;
    if (!["show", "update"].includes(message.action) || !Array.isArray(message.items)) return;
    if (message.action === "show") {
      if (pickerUi) {
        if (pickerUi.pressId !== message.pressId) rememberClosed(pickerUi.pressId);
        pickerUi.host.remove();
      }
      pickerUi = createPickerUi(message.pressId);
    }
    if (pickerUi?.pressId === message.pressId) updatePickerUi(message);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const extensionId = ensureExtensionContext();
    if (!extensionId || (sender.id && sender.id !== extensionId)) return;
    if (message?.type === "mru-picker-ui") {
      receivePickerUi(message);
      sendResponse({ ok: true });
    } else if (message?.type === "mru-picker-control") {
      sendResponse({ ok: applyPickerControl(message) });
    } else if (message?.type === "mru-input-refresh") {
      void refreshConfig();
      sendResponse({ ok: true });
    }
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName && areaName !== "local") return;
    if (Object.hasOwn(changes, "mruShortcuts") || Object.hasOwn(changes, "mruSettings")) void refreshConfig();
  });
  void refreshConfig();
})();
