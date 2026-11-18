import { formatShortcut } from "./shortcuts.js";
import { readSettings } from "./settings.js";

// The previous Chrome commands entry point keeps its original notifications.
export function createLegacyCommands(browser, { reportFailure, getRevision }) {
  async function showStatus(tab, unavailable = false, message = browser.i18n.getMessage("controller_display_unavailable")) {
    const title = tab.title || browser.i18n.getMessage("controller_untitled");
    await Promise.allSettled([
      browser.action.setBadgeText({ tabId: tab.id, text: unavailable ? "!" : "" }),
      browser.action.setTitle({
        tabId: tab.id,
        title: unavailable ? `tabuchan\n${title}\n${message}` : `tabuchan\n${title}`,
      }),
    ]);
  }

  async function showOverlay(tab, state, boundary) {
    if (!tab) {
      return;
    }
    if (!/^https?:\/\//i.test(tab.url ?? "")) {
      await showStatus(tab, true);
      return;
    }

    let shortcuts = [];
    try {
      if (browser.commands) {
        shortcuts = await browser.commands.getAll();
      } else {
        const { shortcuts: bindings } = await readSettings(browser);
        shortcuts = [
          { name: "history-back", shortcut: formatShortcut(bindings.back[0]) },
          { name: "history-forward", shortcut: formatShortcut(bindings.forward[0]) },
        ];
      }
    } catch {
      reportFailure("shortcut information unavailable");
    }

    const message = {
      type: "mru-show",
      revision: getRevision(),
      title: tab.title || browser.i18n.getMessage("controller_untitled"),
      favIconUrl: tab.favIconUrl || "",
      position: state.traversal?.cursor ?? 0,
      pastCount: Math.max(0, (state.traversal?.tabIds.length ?? state.mruTabIds.length) - 1),
      backShortcut: shortcuts.find((command) => command.name === "history-back")?.shortcut || "",
      forwardShortcut: shortcuts.find((command) => command.name === "history-forward")?.shortcut || "",
      boundary,
    };

    try {
      let response;
      try {
        response = await browser.tabs.sendMessage(tab.id, message);
      } catch {
        response = null;
      }
      if (!response?.ok) {
        await browser.scripting.executeScript({ target: { tabId: tab.id }, files: ["src/overlay.js"] });
        response = await browser.tabs.sendMessage(tab.id, message);
      }
      await showStatus(tab, !response?.ok);
    } catch {
      await showStatus(tab, true);
    }
  }

  function listen(handleCommand) {
    browser.commands?.onCommand.addListener((command, tab) => { void handleCommand(command, tab); });
  }

  return { showStatus, showOverlay, listen };
}
