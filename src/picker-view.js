(() => {
  function create(document, { sendControl, translate, ensureContext = () => true }) {
    let pickerUi = null;
    function ensureExtensionContext() { return ensureContext(); }
    function sendPickerControl(ui, action, details = {}) {
      if ((ui.closing && action !== "cancel") || pickerUi !== ui || !ensureExtensionContext()) return;
      const queuedSearch = ui.queuedSearch;
      // Narrowing retains the same selection or falls back to the first final result.
      // Keep broadened/edited queries and never merge across key or cancel actions.
      if (action === "search" && queuedSearch
        && details.query.toLowerCase().startsWith(queuedSearch.details.query.toLowerCase())) {
        queuedSearch.details = details;
        return;
      }
      const control = { details };
      ui.queuedSearch = action === "search" ? control : null;
      ui.controlQueue = ui.controlQueue.then(async () => {
        if (ui.queuedSearch === control) ui.queuedSearch = null;
        if ((ui.closing && action !== "cancel") || pickerUi !== ui || !ensureExtensionContext()) return;
        await sendControl(action, control.details);
      }).catch(() => {});
    }
    function iconUrl(value) {
      if (typeof value !== "string" || value.length === 0) return null;
      if (/^data:image\/(?:png|gif|jpeg|webp|avif|svg\+xml|x-icon|vnd\.microsoft\.icon)[;,]/i.test(value)) return value;
      try {
        const url = new URL(value);
        if (["https:", "chrome-extension:"].includes(url.protocol)) return url.href;
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

    const card = document.createElement("div");
    card.className = "picker";
    card.id = "picker-root";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", translate("picker_select_label", [translate("picker_recent_tabs")]));
    const heading = document.createElement("div");
    heading.className = "heading";
    const label = document.createElement("strong");
    label.textContent = translate("picker_recent_tabs");
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
    searchInput.placeholder = translate("picker_search_placeholder");
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;
    searchInput.setAttribute("aria-label", translate("picker_search_label"));
    search.append(searchInput);
    const list = document.createElement("div");
    list.className = "list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", translate("picker_candidates_label"));
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = translate("picker_controls");
    const announcement = document.createElement("div");
    announcement.className = "announcement";
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    card.append(heading, search, list, hint, announcement);
    document.body.append(card);
    const ui = {
      card, label, search, searchInput, list, rows: [], counter, announcement,
      rowsByTabId: new Map(),
      groupTitles: {},
      itemRevision: null, selectedIndex: -1, mode: null, composing: false, ownsFocus: false,
      closing: false, pendingQuery: null,
      queuedSearch: null,
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
      ui.closing = true;
      sendPickerControl(ui, "cancel");
    });
    pickerUi = ui;
    function createRow(item) {
      const row = document.createElement("div");
      row.className = "row";
      row.id = `mru-picker-option-${item.tabId}`;
      row.dataset.tabId = String(item.tabId);
      row.dataset.inputAvailable = String(item.inputAvailable !== false);
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", "false");
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = typeof item.title === "string" && item.title.trim() ? item.title : translate("picker_untitled");
      title.title = title.textContent;
      const body = document.createElement("span");
      body.className = "item-body";
      body.append(title);
      row.append(createIcon(item.favIconUrl), body);
      if (item.inputAvailable === false) {
        const marker = document.createElement("span");
        marker.className = "unavailable";
        marker.textContent = translate("picker_unavailable");
        marker.title = translate("picker_unavailable_hint");
        body.append(marker);
      }
      return row;
    }

    function renderPickerItems(items, mode) {
      const { list } = pickerUi;
      pickerUi.rows[pickerUi.selectedIndex]?.setAttribute("aria-selected", "false");
      list.replaceChildren();
      let previousGroupId = null;
      let groupContainer = null;
      const rows = [];
      const rowsByTabId = new Map();
      for (const item of items) {
        let container = list;
        const grouped = mode === "tabs" && Number.isInteger(item.groupId) && item.groupId >= 0;
        if (grouped) {
          if (previousGroupId !== item.groupId) {
            groupContainer = document.createElement("div");
            groupContainer.className = "group";
            groupContainer.dataset.groupId = String(item.groupId);
            groupContainer.setAttribute("role", "group");
            const title = pickerUi.groupTitles[item.groupId];
            const groupTitle = typeof title === "string" && title.trim() ? title : translate("picker_unnamed_group");
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
        const previous = pickerUi.rowsByTabId.get(item.tabId);
        const row = previous && previous.title === item.title && previous.favIconUrl === item.favIconUrl
          && previous.inputAvailable === item.inputAvailable ? previous.row : createRow(item);
        rowsByTabId.set(item.tabId, { row, title: item.title, favIconUrl: item.favIconUrl,
          inputAvailable: item.inputAvailable });
        container.append(row);
        rows.push(row);
      }
      if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = mode === "tabs" ? translate("picker_no_matches") : translate("picker_no_history");
        list.append(empty);
      }
      pickerUi.rows = rows;
      pickerUi.rowsByTabId = rowsByTabId;
    }

    function updatePickerUi(message) {
      const mode = message.mode === "tabs" ? "tabs" : "mru";
      const query = mode === "tabs" && typeof message.query === "string" ? message.query : "";
      const modeChanged = pickerUi.mode !== mode;
      if (message.groupTitles) pickerUi.groupTitles = message.groupTitles;
      const rebuilt = Array.isArray(message.items) && (pickerUi.itemRevision !== message.itemRevision || modeChanged);
      if (rebuilt) {
        renderPickerItems(message.items, mode);
        pickerUi.itemRevision = message.itemRevision;
        pickerUi.selectedIndex = -1;
      }
      if (modeChanged) {
        pickerUi.card.dataset.mode = mode;
        pickerUi.label.textContent = mode === "tabs" ? translate("picker_tab_list") : translate("picker_recent_tabs");
        pickerUi.card.setAttribute("aria-label", translate("picker_select_label", [pickerUi.label.textContent]));
        pickerUi.mode = mode;
        pickerUi.search.className = mode === "tabs" ? "search" : "search search-hidden";
        pickerUi.searchInput.readOnly = mode !== "tabs";
        pickerUi.searchInput.value = query;
        pickerUi.pendingQuery = query;
      }
      if (pickerUi.search.dataset.query !== query) pickerUi.search.dataset.query = query;
      if (modeChanged || !pickerUi.ownsFocus) {
        // Entering search is a fresh focus transfer, even if the initial hidden MRU input did not retain focus.
        pickerUi.searchInput.focus({ preventScroll: true });
        pickerUi.ownsFocus = document.activeElement === pickerUi.searchInput && document.hasFocus();
      }
      const { rows, list } = pickerUi;
      if (rows.length === 0) {
        if (rebuilt || modeChanged) {
          list.removeAttribute("aria-activedescendant");
          pickerUi.counter.textContent = translate("picker_position", ["0", "0"]);
          pickerUi.announcement.textContent = translate("picker_no_candidates");
        }
        return;
      }
      if (!Number.isInteger(message.selectedIndex) || message.selectedIndex < 0
        || message.selectedIndex >= rows.length) return;
      if (!rebuilt && !modeChanged && pickerUi.selectedIndex === message.selectedIndex) return;
      if (pickerUi.selectedIndex !== message.selectedIndex) {
        rows[pickerUi.selectedIndex]?.setAttribute("aria-selected", "false");
        rows[message.selectedIndex].setAttribute("aria-selected", "true");
        pickerUi.selectedIndex = message.selectedIndex;
      }
      const selected = rows[message.selectedIndex];
      list.setAttribute("aria-activedescendant", selected.id);
      pickerUi.counter.textContent = translate("picker_position", [String(message.selectedIndex + 1), String(rows.length)]);
      pickerUi.announcement.textContent = selected.textContent;
      const scrollTop = list.scrollTop;
      const rowTop = selected.offsetTop;
      if (rowTop < scrollTop) {
        list.scrollTop = rowTop;
      } else {
        const rowBottom = rowTop + selected.offsetHeight;
        const listHeight = list.clientHeight;
        if (rowBottom > scrollTop + listHeight) list.scrollTop = rowBottom - listHeight;
      }
    }


    function handleKey(event) {
      const ui = pickerUi;
      if (!ui || !event.isTrusted || !ensureExtensionContext()) return false;
      if (ui.composing || event.isComposing || event.keyCode === 229) {
        event.stopImmediatePropagation();
        return true;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"].includes(event.code)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (event.code === "ArrowRight" || (event.repeat && event.code !== "ArrowUp" && event.code !== "ArrowDown")) return true;
        sendPickerControl(ui, "key", { code: event.code, repeat: event.repeat === true });
        return true;
      }
      event.stopImmediatePropagation();
      return true;
    }

    return {
      update: updatePickerUi,
      handleKey,
      get root() { return pickerUi?.card; },
      get searchInput() { return pickerUi?.searchInput; },
      close() {
        if (!pickerUi) return;
        pickerUi.closing = true;
        pickerUi.card.remove();
        pickerUi = null;
      },
    };
  }
  globalThis.MruPickerView = Object.freeze({ create });
})();
