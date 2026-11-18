(() => {
  if (globalThis.__mruPageInput) return;

  const guard = { ready: false };
  globalThis.__mruPageInput = guard;
  let pressState = globalThis.MruPressState.create();
  const modifiers = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
  const { PICKER_KEYS, MODIFIER_CODES, modifierMask } = globalThis.MruInputProtocol;
  const frameId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const closedPressIds = new Set();
  const closedHostFocus = new Map();
  const { normalizeSettings, DEFAULT_HOLD_DELAY_MS, DEFAULT_MAX_PAST_TABS,
    DEFAULT_SEARCH_MATCH_MODE } = globalThis.MruSettingsRules;
  const pickerModel = globalThis.MruPickerModel;
  let shortcuts = null;
  let shortcutModifiers = 0;
  let holdDelayMs = DEFAULT_HOLD_DELAY_MS;
  let maxPastTabs = DEFAULT_MAX_PAST_TABS;
  let searchMatchMode = DEFAULT_SEARCH_MATCH_MODE;
  let currentPress = null;
  let pressCounter = 0;
  let holdTimer;
  let configVersion = 0;
  let configTask = null;
  let configPending = false;
  let pickerHost = null;

  async function send(message) {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch {
      return null;
    }
  }

  function displayMessage(action, press) {
    const picker = press.picker;
    const message = {
      type: "mru-picker-display", action, pressId: press.id,
      selectedIndex: picker?.selectedIndex ?? -1,
      mode: picker?.mode || press.mode, query: picker?.query || "",
      itemRevision: picker?.itemRevision ?? 1,
      restoreFocus: press.restoreFocus !== false,
    };
    if (action !== "hide" && picker && (action === "show" || press.lastDisplay?.itemRevision !== picker.itemRevision)) {
      message.items = picker.items;
    }
    if (action !== "hide" && picker && (action === "show" || press.lastDisplay?.groupTitles !== picker.groupTitles)) {
      message.groupTitles = picker.groupTitles;
    }
    return message;
  }

  function cancelPress({ restoreFocus = false } = {}) {
    clearTimeout(holdTimer);
    pressState.cancel();
    const cancelled = currentPress;
    currentPress = null;
    if (cancelled) {
      cancelled.phase = "cancelled";
      try { cancelled.connection?.disconnect(); } catch { /* The extension may already be invalidated. */ }
      cancelled.restoreFocus = restoreFocus;
      return send(displayMessage("hide", cancelled)).then((response) => {
        if (restoreFocus && response?.ok && cancelled.focusTransferred && currentPress === null
          && document.visibilityState !== "hidden"
          && (response.restoreFocusAllowed === true || document.hasFocus())
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
    if (pickerHost) hidePickerHost(pickerHost.pressId);
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
      && (value.ctrlKey || value.altKey || value.metaKey)
      && modifiers.every((modifier) => typeof value[modifier] === "boolean");
  }

  function isBindingList(value) {
    return Array.isArray(value) && value.length > 0 && value.every(isBinding);
  }

  function refreshConfig({ changed = false } = {}) {
    if (!ensureExtensionContext()) return Promise.resolve();
    if (configTask && !changed) return configTask;
    configVersion += 1;
    configPending = true;
    disableInput();
    if (!configTask) {
      configTask = Promise.resolve().then(async () => {
        while (configPending) {
          configPending = false;
          const version = configVersion;
          const response = await send({ type: "mru-config" });
          if (version !== configVersion || !ensureExtensionContext()) continue;
          if (response?.ok && isBindingList(response.shortcuts?.back) && isBindingList(response.shortcuts?.forward)) {
            shortcuts = response.shortcuts;
          shortcutModifiers = [...shortcuts.back, ...shortcuts.forward]
            .reduce((mask, binding) => mask | modifierMask(binding), 0);
            const settings = normalizeSettings(response);
            holdDelayMs = settings.holdDelayMs;
            maxPastTabs = settings.maxPastTabs;
            searchMatchMode = settings.searchMatchMode;
            pressState = globalThis.MruPressState.create(holdDelayMs);
            guard.ready = true;
          }
        }
      }).finally(() => {
        configTask = null;
        if (configPending) void refreshConfig();
      });
    }
    return configTask;
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
      if (currentPress !== press || press.phase === "cancelled") return;
      if (!ensureExtensionContext()) return;
      const message = displayMessage(action, press);
      const { mode, query, selectedIndex, itemRevision } = message;
      const previous = press.lastDisplay;
      if (action !== "show" && previous?.itemRevision === itemRevision
        && previous.mode === mode && previous.query === query && previous.selectedIndex === selectedIndex) return;
      const response = await send(message);
      if (response?.ok) {
        press.lastDisplay = {
          mode, query, selectedIndex, itemRevision, groupTitles: message.groupTitles ?? previous?.groupTitles,
        };
      } else if (currentPress === press) disableInput();
    });
  }

  async function openPicker(press, mode = "mru") {
    if (currentPress !== press || press.phase === "cancelled") return;
    if (!press.connection) {
      try {
        // A Worker restart must cancel a press even when its owner is a child frame.
        const connection = chrome.runtime.connect({ name: "mru-input-lifetime" });
        press.connection = connection;
        connection.onDisconnect.addListener(() => {
          if (currentPress === press) void cancelPress({ restoreFocus: true });
        });
      } catch {
        disableInput();
        return;
      }
    }
    press.mode = mode;
    press.phase = "loading";
    const requestVersion = ++press.requestVersion;
    const response = await send({ type: "mru-list", direction: press.direction, mode, pressId: press.id });
    if (currentPress !== press || press.phase === "cancelled" || requestVersion !== press.requestVersion) return;
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
    press.picker = pickerModel.create(response, mode, (press.picker?.itemRevision ?? 0) + 1);
    press.focusTransferred = true;
    press.phase = "visible";
    displayPicker(press.hostRequested ? "update" : "show", press);
    press.hostRequested = true;
  }

  async function moveOnce(direction, binding, commit) {
    const response = await send({ type: "mru-move", direction, modifiers: modifierMask(binding), commit });
    if (response === null) disableInput();
  }

  function applyPressAction(action, press, commit = false) {
    if (!action || currentPress !== press) return;
    if (action.type === "list") {
      void openPicker(press);
    } else if (action.type === "tap") {
      currentPress = null;
      void moveOnce(action.direction, press.binding, commit);
    }
  }

  function startPress(direction, binding) {
    const now = performance.now();
    if (!pressState.start(direction, now)) return;
    const press = {
      id: `${frameId}-${++pressCounter}`,
      direction,
      binding,
      phase: "held",
      mode: "mru",
      hostRequested: false,
      requestVersion: 0,
      focusTransferred: false,
      previousFocus: document.activeElement,
      picker: null,
      displayQueue: Promise.resolve(),
      lastDisplay: null,
      connection: null,
    };
    currentPress = press;
    holdTimer = setTimeout(() => {
      if (currentPress === press && press.phase !== "cancelled" && ensureExtensionContext()) {
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
    pickerModel.filter(press.picker, query, searchMatchMode);
    displayPicker("update", press);
  }

  function handlePickerKey(event) {
    const press = currentPress;
    if (!press || press.phase === "held") return false;
    if (!PICKER_KEYS.has(event.code)) {
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
      if (!event.repeat && press.phase !== "loading" && press.picker) void selectItem(press);
      return true;
    }
    if (event.code === "ArrowRight") return true;
    if (event.code === "ArrowLeft") {
      if (!event.repeat && press.phase !== "loading") void openPicker(press, press.mode === "mru" ? "tabs" : "mru");
      return true;
    }
    if (press.phase === "loading" || !press.picker) return true;
    const change = event.code === "ArrowUp" ? -1 : 1;
    if (pickerModel.move(press.picker, change)) displayPicker("selection", press);
    return true;
  }

  function applyPickerControl(message) {
    const press = currentPress;
    if (!press || press.id !== message.pressId || press.phase === "cancelled" || press.phase === "held") return false;
    if (message.action === "cancel") {
      void cancelPress({ restoreFocus: message.restoreFocus === true });
      return true;
    }
    if (message.action === "search") {
      if (typeof message.query !== "string") return false;
      if (press.mode !== "tabs" || press.phase === "loading" || !press.picker) return true;
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

  window.addEventListener("keydown", (event) => {
    if (!event.isTrusted) return;
    if (!ensureExtensionContext()) return;
    if (!guard.ready || event.isComposing) return;
    if (handlePickerKey(event)) return;
    const modifier = MODIFIER_CODES[event.code];
    if (modifier & shortcutModifiers) {
      if (!event.repeat) void send({ type: "mru-finish", modifiers: modifierMask(event) & ~modifier });
      return;
    }
    if (!event.ctrlKey && !event.altKey && !event.metaKey) return;
    const backBinding = shortcuts.back.find((binding) => matches(event, binding));
    const binding = backBinding ?? shortcuts.forward.find((binding) => matches(event, binding));
    if (!binding) return;
    consume(event);
    if (!event.repeat && currentPress === null) {
      startPress(backBinding ? "back" : "forward", binding);
    }
  }, true);

  window.addEventListener("keyup", (event) => {
    if (!event.isTrusted || !ensureExtensionContext()) return;
    const press = currentPress;
    let action;
    if (press) {
      const required = modifierMask(press.binding);
      const commit = (modifierMask(event) & required) !== required;
      if (event.code === press.binding.code || commit) {
        consume(event);
        clearTimeout(holdTimer);
        action = pressState.release(performance.now());
        applyPressAction(action, press, commit);
      }
    }
    if (MODIFIER_CODES[event.code] && action?.type !== "tap") {
      const pickerOpen = Boolean(press && press.phase !== "held");
      void send({ type: "mru-finish", modifiers: modifierMask(event), pickerOpen });
    }
  }, true);

  window.addEventListener("blur", () => {
    // Moving focus into the extension frame must keep the source press alive.
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
    if (closedPressIds.size > 64) {
      const oldest = closedPressIds.values().next().value;
      closedPressIds.delete(oldest);
      closedHostFocus.delete(oldest);
    }
  }

  function hidePickerHost(pressId, restoreFocus = true) {
    rememberClosed(pressId);
    if (pickerHost?.pressId !== pressId) {
      return { ok: true, restoreFocusAllowed: restoreFocus && closedHostFocus.get(pressId) === true
        && document.visibilityState !== "hidden" && document.hasFocus() };
    }
    const host = pickerHost;
    const focused = restoreFocus && document.visibilityState !== "hidden" && document.hasFocus();
    pickerHost = null;
    host.frame.remove();
    closedHostFocus.set(pressId, focused);
    if (focused && host.previousFocus?.isConnected) host.previousFocus.focus({ preventScroll: true });
    return { ok: true, restoreFocusAllowed: focused };
  }

  function receivePickerHost(message) {
    if (window !== window.top || typeof message.pressId !== "string") return;
    if (message.action === "hide") {
      return hidePickerHost(message.pressId, message.restoreFocus !== false);
    }
    if (message.action === "resize") {
      if (pickerHost?.pressId === message.pressId && Number.isInteger(message.height)) {
        pickerHost.frame.style.setProperty("height", `${Math.max(1, Math.min(1000, message.height))}px`, "important");
      }
      return;
    }
    if (message.action !== "show" || document.visibilityState === "hidden"
      || closedPressIds.has(message.pressId) || !document.documentElement) return;
    if (pickerHost) hidePickerHost(pickerHost.pressId, false);
    const frame = document.createElement("iframe");
    frame.id = "mru-tab-switcher-picker";
    frame.title = chrome.i18n.getMessage("picker_title");
    frame.src = chrome.runtime.getURL("picker.html");
    frame.setAttribute("allow", "");
    frame.referrerPolicy = "no-referrer";
    for (const [property, value] of Object.entries({
      all: "initial", position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)",
      width: "min(520px, calc(100vw - 32px))", height: "640px", border: "0", "z-index": "2147483647",
      "color-scheme": "light dark", "background-color": "transparent",
    })) frame.style.setProperty(property, value, "important");
    pickerHost = { frame, pressId: message.pressId, previousFocus: document.activeElement, nonce: null };
    document.documentElement.append(frame);
  }

  window.addEventListener("message", (event) => {
    if (!event.isTrusted) return;
    const extensionId = ensureExtensionContext();
    if (!extensionId) return;
    const host = pickerHost;
    if (!host || event.source !== host.frame.contentWindow
      || event.origin !== `chrome-extension://${extensionId}`) return;
    const message = event.data;
    if (message?.type === "mru-picker-ready" && typeof message.nonce === "string" && message.nonce.length <= 128) {
      if (host.nonce) return;
      host.nonce = message.nonce;
      void send({ type: "mru-picker-bind", pressId: host.pressId, nonce: host.nonce,
        viewportHeight: window.innerHeight }).then((response) => {
        if (!response?.ok && pickerHost === host) hidePickerHost(host.pressId);
      });
    } else if (message?.type === "mru-picker-closed" && message.nonce === host.nonce) {
      hidePickerHost(host.pressId);
      if (currentPress?.id === host.pressId) void cancelPress({ restoreFocus: true });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const extensionId = ensureExtensionContext();
    if (!extensionId || (sender.id && sender.id !== extensionId)) return;
    if (message?.type === "mru-picker-host") {
      sendResponse(receivePickerHost(message) ?? { ok: true });
    } else if (message?.type === "mru-picker-control") {
      sendResponse({ ok: applyPickerControl(message) });
    } else if (message?.type === "mru-input-refresh") {
      void refreshConfig({ changed: true });
      sendResponse({ ok: true });
    }
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName && areaName !== "local") return;
    if (Object.hasOwn(changes, "mruShortcuts") || Object.hasOwn(changes, "mruSettings")) void refreshConfig({ changed: true });
  });
  void refreshConfig();
})();
