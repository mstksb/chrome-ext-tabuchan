import { readSettings } from "./settings.js";
import { canUsePageInput } from "./tab-access.js";

const INPUT_FILES = ["src/press-state.js", "src/page-input.js"];
const MESSAGE_TYPES = new Set([
  "mru-config",
  "mru-move",
  "mru-list",
  "mru-select",
  "mru-picker-display",
  "mru-picker-input",
]);
const PICKER_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"]);

export function createInputBridge(browser, controller) {
  let started = false;

  async function getSource(sender, { requireActive = true, requireAccess = true } = {}) {
    if (sender.id !== browser.runtime.id || !Number.isInteger(sender.tab?.id)) return null;
    const tab = await browser.tabs.get(sender.tab.id);
    if (requireActive && !tab.active) return null;
    if (requireAccess && !await canUsePageInput(browser, tab)) return null;
    return tab;
  }

  async function sendPicker(tabId, message) {
    try {
      return await browser.tabs.sendMessage(tabId, message, { frameId: 0 });
    } catch {
      await browser.scripting.executeScript({ target: { tabId, frameIds: [0] }, files: INPUT_FILES });
      return browser.tabs.sendMessage(tabId, message, { frameId: 0 });
    }
  }

  async function displayPicker(message, sender) {
    const hiding = message.action === "hide";
    const tab = await getSource(sender, { requireActive: !hiding, requireAccess: !hiding });
    if (!tab || !["show", "update", "hide"].includes(message.action)
      || typeof message.pressId !== "string" || message.pressId.length > 128) {
      return { ok: false, error: "invalid-picker" };
    }
    const items = Array.isArray(message.items) ? message.items : [];
    return sendPicker(tab.id, {
      type: "mru-picker-ui",
      action: message.action,
      pressId: message.pressId,
      sourceFrameId: sender.frameId ?? 0,
      items,
      mode: message.mode === "tabs" ? "tabs" : "mru",
      query: typeof message.query === "string" ? message.query : "",
      selectedIndex: Number.isInteger(message.selectedIndex) ? message.selectedIndex : -1,
    });
  }

  async function relayPickerInput(message, sender) {
    if (sender.frameId !== 0 || typeof message.pressId !== "string" || message.pressId.length === 0
      || message.pressId.length > 128 || !Number.isSafeInteger(message.sourceFrameId) || message.sourceFrameId < 0
      || !["search", "key", "cancel"].includes(message.action)
      || (message.query !== undefined && typeof message.query !== "string")
      || (message.repeat !== undefined && typeof message.repeat !== "boolean")
      || (message.action === "search" && typeof message.query !== "string")
      || (message.action === "key" && !PICKER_KEYS.has(message.code))) {
      return { ok: false, error: "invalid-picker-input" };
    }
    const tab = await getSource(sender);
    if (!tab) return { ok: false, error: "page-unavailable" };
    return browser.tabs.sendMessage(tab.id, {
      type: "mru-picker-control",
      pressId: message.pressId,
      action: message.action,
      query: message.query,
      code: message.code,
      repeat: message.repeat === true,
    }, { frameId: message.sourceFrameId });
  }

  async function handleMessage(message, sender) {
    if (!MESSAGE_TYPES.has(message?.type)) return { ok: false, error: "unknown-message" };
    if (message.type === "mru-picker-display") return displayPicker(message, sender);
    if (message.type === "mru-picker-input") return relayPickerInput(message, sender);
    const tab = await getSource(sender, { requireActive: message.type !== "mru-config" });
    if (!tab) return { ok: false, error: "page-unavailable" };

    if (message.type === "mru-config") {
      return { ok: true, ...await readSettings(browser) };
    }
    if (message.type === "mru-select") {
      const selection = message.selection;
      if (!selection || selection.sourceTabId !== tab.id
        || (selection.mode !== undefined && selection.mode !== "mru" && selection.mode !== "tabs")
        || !Number.isInteger(selection.generation) || !Number.isInteger(selection.targetTabId)) {
        return { ok: false, error: "invalid-selection" };
      }
      return controller.selectCandidate(selection, tab);
    }
    if (message.direction !== "back" && message.direction !== "forward") {
      return { ok: false, error: "invalid-direction" };
    }
    if (message.type === "mru-list") {
      const mode = message.mode ?? "mru";
      if (mode !== "mru" && mode !== "tabs") return { ok: false, error: "invalid-mode" };
      return controller.getCandidates(message.direction, tab, mode);
    }
    return controller.handleMove(message.direction, tab);
  }

  async function refreshExistingPages(inject) {
    const tabs = await browser.tabs.query({});
    await Promise.allSettled(tabs.filter((tab) => /^https?:\/\//i.test(tab.url ?? "")).map(async (tab) => {
      if (inject && await canUsePageInput(browser, tab)) {
        await browser.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, files: INPUT_FILES });
      }
      try {
        await browser.tabs.sendMessage(tab.id, { type: "mru-input-refresh" });
      } catch {
        // A restricted or navigating page can have no content-script receiver.
      }
    }));
  }

  function start() {
    if (started) return;
    started = true;
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!MESSAGE_TYPES.has(message?.type)) return;
      handleMessage(message, sender).then(sendResponse).catch(() => {
        sendResponse({ ok: false, error: "input-unavailable" });
      });
      return true;
    });
    browser.runtime.onInstalled.addListener(() => {
      void refreshExistingPages(true).catch(() => console.warn("tabuchan: page input initialization failed"));
    });
    browser.permissions.onAdded.addListener(() => {
      void refreshExistingPages(true).catch(() => console.warn("tabuchan: page input refresh failed"));
    });
    browser.permissions.onRemoved.addListener(() => {
      void refreshExistingPages(false).catch(() => console.warn("tabuchan: page input refresh failed"));
    });
  }

  return { start, handleMessage };
}
