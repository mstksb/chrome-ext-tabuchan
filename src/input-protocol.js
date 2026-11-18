(() => {
  if (globalThis.MruInputProtocol) return;
  const PICKER_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"]);
  const INPUT_FILES = ["src/settings-rules.js", "src/input-protocol.js", "src/picker-model.js", "src/press-state.js", "src/page-input.js"];
  const MESSAGE_TYPES = new Set(["mru-config", "mru-move", "mru-list", "mru-select", "mru-picker-display", "mru-picker-bind"]);
  const isPressId = (value) => typeof value === "string" && value.length > 0 && value.length <= 128;
  function isControl(message) {
    return message && ["search", "key", "cancel"].includes(message.action)
      && (message.query === undefined || typeof message.query === "string")
      && (message.repeat === undefined || typeof message.repeat === "boolean")
      && (message.action !== "search" || typeof message.query === "string")
      && (message.action !== "key" || PICKER_KEYS.has(message.code));
  }
  function isDisplay(message) {
    return isPressId(message?.pressId) && ["show", "update", "selection", "hide"].includes(message.action)
      && (message.action === "hide" || (Number.isInteger(message.selectedIndex)
        && ["mru", "tabs"].includes(message.mode)
        && typeof message.query === "string"
        && Number.isInteger(message.itemRevision) && message.itemRevision > 0
        && (message.items === undefined || (Array.isArray(message.items)
          && message.items.every((item) => Number.isInteger(item?.tabId))))))
      && (message.action !== "show" || Array.isArray(message.items));
  }
  globalThis.MruInputProtocol = Object.freeze({ PICKER_KEYS, INPUT_FILES, MESSAGE_TYPES, isPressId, isControl, isDisplay });
})();
