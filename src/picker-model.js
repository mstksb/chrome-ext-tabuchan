(() => {
  if (globalThis.MruPickerModel) return;
  function create(response, mode, itemRevision) {
    return {
      mode, query: "", allItems: response.items, items: response.items,
      selectedIndex: response.selectedIndex, generation: response.generation,
      sourceTabId: response.sourceTabId, itemRevision, searchTitles: null,
      searchKeywords: null, searchMatchMode: null,
    };
  }
  function matchesTitle(title, keywords, matchMode) {
    if (matchMode !== "prefix") return keywords.every((keyword) => title.includes(keyword));
    let offset = 0;
    for (let index = 0; index < keywords.length; index += 1) {
      const found = title.indexOf(keywords[index], offset);
      if (found < 0 || (index === 0 && found !== 0)) return false;
      offset = found + keywords[index].length;
    }
    return true;
  }
  function filter(picker, query, matchMode = "contains") {
    const keywords = query.normalize("NFC").toLowerCase().split(/\s+/u).filter(Boolean);
    if (picker.searchMatchMode === matchMode && picker.searchKeywords?.length === keywords.length
      && keywords.every((keyword, index) => keyword === picker.searchKeywords[index])) {
      picker.query = query;
      return;
    }
    picker.searchKeywords = keywords;
    picker.searchMatchMode = matchMode;
    const selectedTabId = picker.items[picker.selectedIndex]?.tabId;
    let items = picker.allItems;
    if (keywords.length > 0) {
      picker.searchTitles ??= picker.allItems.map((item) => String(item.title || "").normalize("NFC").toLowerCase());
      items = picker.allItems.filter((item, index) => matchesTitle(picker.searchTitles[index], keywords, matchMode));
    }
    if (items !== picker.items
      && (items.length !== picker.items.length || items.some((item, index) => item !== picker.items[index]))) {
      picker.items = items;
      picker.itemRevision += 1;
    } else if (keywords.length === 0) {
      picker.items = items;
    }
    picker.query = query;
    const previousIndex = picker.items.findIndex((item) => item.tabId === selectedTabId);
    picker.selectedIndex = previousIndex >= 0 ? previousIndex : picker.items.length > 0 ? 0 : -1;
  }
  function move(picker, change) {
    const index = Math.max(0, Math.min(picker.items.length - 1, picker.selectedIndex + change));
    if (picker.items.length === 0 || index === picker.selectedIndex) return false;
    picker.selectedIndex = index;
    return true;
  }
  globalThis.MruPickerModel = Object.freeze({ create, filter, move });
})();
