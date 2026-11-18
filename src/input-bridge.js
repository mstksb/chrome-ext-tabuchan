import { readSettings } from "./settings.js";
import { canUsePageInput, createPageInputAccessCheck } from "./tab-access.js";
import "./input-protocol.js";

const { INPUT_FILES, MESSAGE_TYPES, isModifierMask, isPressId, isControl, isDisplay } = globalThis.MruInputProtocol;

export function createInputBridge(browser, controller) {
  let started = false;
  let configRead = null;
  let shortcutQueue = Promise.resolve();
  const sessions = new Map();
  const showRequests = new Map();
  const pendingFrames = new Map();
  const closingPickerPorts = new WeakSet();
  const inputLifetimes = new Set();
  const pickerUrl = () => `chrome-extension://${browser.runtime.id}/picker.html`;

  function queueShortcut(handle) {
    const request = shortcutQueue.then(handle);
    shortcutQueue = request.catch(() => {});
    return request;
  }

  function readInputSettings() {
    if (!configRead) {
      const request = readSettings(browser);
      configRead = request;
      const clear = () => { if (configRead === request) configRead = null; };
      request.then(clear, clear);
    }
    return configRead;
  }

  async function getSource(sender, { requireActive = true, requireAccess = true } = {}) {
    if (sender.id !== browser.runtime.id || !Number.isInteger(sender.tab?.id)) return null;
    const tab = await browser.tabs.get(sender.tab.id);
    if (requireActive && !tab.active) return null;
    if (requireAccess && !await canUsePageInput(browser, tab)) return null;
    return tab;
  }

  async function sendHost(tabId, message) {
    try {
      return await browser.tabs.sendMessage(tabId, { type: "mru-picker-host", ...message }, { frameId: 0 });
    } catch {
      if (message.action !== "show") return { ok: true };
      await browser.scripting.executeScript({ target: { tabId, frameIds: [0] }, files: INPUT_FILES });
      return browser.tabs.sendMessage(tabId, { type: "mru-picker-host", ...message }, { frameId: 0 });
    }
  }

  function post(port, message) {
    try { port.postMessage(message); return true; } catch { return false; }
  }

  function sameSource(session, sender) {
    return session.pressId && session.sourceFrameId === (sender.frameId ?? 0)
      && session.sourceDocumentId === sender.documentId;
  }

  function discardShowRequest(tabId, request) {
    if (showRequests.get(tabId) === request) showRequests.delete(tabId);
  }

  async function closeSession(tabId, session, { restoreFocus = true, cancelSource = false } = {}) {
    if (sessions.get(tabId) !== session) return;
    sessions.delete(tabId);
    discardShowRequest(tabId, session.showRequest);
    const { port } = session;
    if (port) closingPickerPorts.add(port);
    // Let the host check focus while the picker is still present.
    const response = await sendHost(tabId, { action: "hide", pressId: session.pressId, restoreFocus });
    if (port) {
      post(port, { type: "close" });
      port.disconnect();
    }
    if (cancelSource) {
      try {
        await browser.tabs.sendMessage(tabId, {
          type: "mru-picker-control", action: "cancel", pressId: session.pressId, restoreFocus,
        }, { frameId: session.sourceFrameId });
      } catch { /* The source may already have navigated away. */ }
    }
    return response;
  }

  async function displayPicker(message, sender) {
    if (sender.id !== browser.runtime.id || !Number.isInteger(sender.tab?.id) || !isDisplay(message)) {
      return { ok: false, error: "invalid-picker" };
    }
    const hiding = message.action === "hide";
    const tabId = sender.tab.id;
    const showRequest = message.action === "show" ? {
      pressId: message.pressId, sourceFrameId: sender.frameId ?? 0, sourceDocumentId: sender.documentId,
    } : null;
    // Register ordering before asynchronous permission checks can complete out of order.
    if (showRequest) showRequests.set(tabId, showRequest);
    else if (hiding) {
      const pending = showRequests.get(tabId);
      if (pending?.pressId === message.pressId && sameSource(pending, sender)) discardShowRequest(tabId, pending);
    }
    const tab = await getSource(sender, { requireActive: !hiding, requireAccess: !hiding }).catch((error) => {
      discardShowRequest(tabId, showRequest);
      throw error;
    });
    if (!tab) {
      discardShowRequest(tabId, showRequest);
      return { ok: false, error: "invalid-picker" };
    }
    if (showRequest && showRequests.get(tabId) !== showRequest) return { ok: false, error: "stale-picker" };
    let session = sessions.get(tab.id);
    if (hiding) {
      if (session && (session.pressId !== message.pressId || !sameSource(session, sender))) {
        return { ok: false, error: "stale-picker" };
      }
      if (session) return closeSession(tab.id, session, { restoreFocus: message.restoreFocus !== false });
      return sendHost(tab.id, { action: "hide", pressId: message.pressId, restoreFocus: message.restoreFocus !== false });
    }
    if (message.action === "show") {
      if (session) await closeSession(tab.id, session, { restoreFocus: false, cancelSource: true });
      if (showRequests.get(tab.id) !== showRequest) return { ok: false, error: "stale-picker" };
      session = { pressId: message.pressId, sourceFrameId: sender.frameId ?? 0,
        sourceDocumentId: sender.documentId, showRequest, itemRevision: null,
        unboundDisplay: null, port: null, maxListHeight: 480 };
      sessions.set(tab.id, session);
    } else if (!session || session.pressId !== message.pressId || !sameSource(session, sender)) {
      return { ok: false, error: "stale-picker" };
    }
    if (!message.items && message.itemRevision !== session.itemRevision) return { ok: false, error: "missing-items" };
    if (session.port) {
      if (!post(session.port, { ...message, type: "display", maxListHeight: session.maxListHeight })) {
        await closeSession(tab.id, session, { cancelSource: true });
        return { ok: false, error: "picker-unavailable" };
      }
      session.itemRevision = message.itemRevision;
      return { ok: true };
    }
    const pendingDisplay = session.unboundDisplay;
    session.itemRevision = message.itemRevision;
    session.unboundDisplay = {
      mode: message.mode, query: message.query, selectedIndex: message.selectedIndex,
      itemRevision: message.itemRevision, items: message.items ?? pendingDisplay?.items,
      groupTitles: message.groupTitles ?? pendingDisplay?.groupTitles,
    };
    if (message.action === "show") {
      const response = await sendHost(tab.id, { action: "show", pressId: message.pressId });
      if (!response?.ok) await closeSession(tab.id, session, { cancelSource: true });
      return response;
    }
    return { ok: true };
  }

  async function bindPicker(message, sender) {
    if (sender.frameId !== 0 || !isPressId(message.pressId) || !isPressId(message.nonce)) {
      return { ok: false, error: "invalid-picker-binding" };
    }
    const tab = await getSource(sender);
    const session = tab && sessions.get(tab.id);
    const pending = pendingFrames.get(message.nonce);
    if (!session?.unboundDisplay || session.pressId !== message.pressId || session.port || !pending || pending.tabId !== tab.id) {
      return { ok: false, error: "stale-picker-binding" };
    }
    pendingFrames.delete(message.nonce);
    session.port = pending.port;
    session.maxListHeight = Math.max(100, Math.min(480, Number.isFinite(message.viewportHeight) ? message.viewportHeight * 0.6 : 480));
    if (!post(session.port, { type: "display", ...session.unboundDisplay, maxListHeight: session.maxListHeight })) {
      await closeSession(tab.id, session, { cancelSource: true });
      return { ok: false, error: "picker-unavailable" };
    }
    // A disconnected picker ends the session, so this snapshot cannot be used again.
    session.unboundDisplay = null;
    return { ok: true };
  }

  async function relayControl(tabId, port, message) {
    const session = sessions.get(tabId);
    if (!session || session.port !== port || !isControl(message)) return { ok: false, error: "invalid-picker-input" };
    const tab = await browser.tabs.get(tabId);
    if (!tab.active || !await canUsePageInput(browser, tab)) {
      await closeSession(tabId, session, { restoreFocus: false, cancelSource: true });
      return { ok: false, error: "page-unavailable" };
    }
    if (sessions.get(tabId) !== session) return { ok: false, error: "invalid-picker-input" };
    return browser.tabs.sendMessage(tabId, {
      type: "mru-picker-control", pressId: session.pressId, action: message.action,
      query: message.query, code: message.code, repeat: message.repeat === true,
    }, { frameId: session.sourceFrameId });
  }

  function connectPicker(port) {
    const sender = port.sender;
    if (port.name === "mru-input-lifetime" && sender?.id === browser.runtime.id
      && Number.isInteger(sender.tab?.id)) {
      // This connection grants no authority; it only notifies the source when the Worker exits.
      inputLifetimes.add(port);
      port.onDisconnect.addListener(() => inputLifetimes.delete(port));
      return;
    }
    if (port.name !== "mru-picker" || sender?.id !== browser.runtime.id
      || sender.url !== pickerUrl() || !Number.isInteger(sender.tab?.id)
      || !Number.isInteger(sender.frameId) || sender.frameId <= 0) {
      port.disconnect();
      return;
    }
    const tabId = sender.tab.id;
    let nonce = null;
    let controls = Promise.resolve();
    port.onMessage.addListener((message) => {
      if (message?.type === "hello" && !nonce && isPressId(message.nonce)) {
        if (pendingFrames.has(message.nonce)) { port.disconnect(); return; }
        const pendingForTab = [...pendingFrames.values()].filter((value) => value.tabId === tabId);
        if (pendingForTab.length >= 8) { port.disconnect(); return; }
        nonce = message.nonce;
        pendingFrames.set(nonce, { tabId, port });
        post(port, { type: "ready" });
      } else if (message?.type === "control" && Number.isSafeInteger(message.requestId)) {
        const sendResult = (result) => {
          // Rejecting a pending input while closing would make the picker remove itself early.
          if (!closingPickerPorts.has(port)) post(port, { type: "result", requestId: message.requestId, ...result });
        };
        controls = controls.then(async () => {
          if (!closingPickerPorts.has(port)) sendResult(await relayControl(tabId, port, message));
        }).catch(() => {
          sendResult({ ok: false, error: "input-unavailable" });
        });
      } else if (message?.type === "modifiers" && isModifierMask(message.modifiers) && sessions.get(tabId)?.port === port) {
        void queueShortcut(() => controller.finishShortcut(sender.tab, message.modifiers, { keepTraversal: true })).catch(() => {});
      } else if (message?.type === "resize" && Number.isInteger(message.height)) {
        const session = sessions.get(tabId);
        if (session?.port === port) {
          void sendHost(tabId, { action: "resize", pressId: session.pressId,
            height: Math.max(1, Math.min(1000, message.height)) }).catch(() => {});
        }
      }
    });
    port.onDisconnect.addListener(() => {
      if (pendingFrames.get(nonce)?.port === port) pendingFrames.delete(nonce);
      const session = sessions.get(tabId);
      if (session?.port === port) {
        session.port = null;
        void closeSession(tabId, session, { cancelSource: true }).catch(() => {});
      }
    });
  }

  async function handleMessage(message, sender) {
    if (!MESSAGE_TYPES.has(message?.type)) return { ok: false, error: "unknown-message" };
    if (message.type === "mru-picker-display") return displayPicker(message, sender);
    if (message.type === "mru-picker-bind") return bindPicker(message, sender);
    if (message.type === "mru-finish") {
      const tab = sender.tab;
      if (sender.id !== browser.runtime.id || !Number.isInteger(tab?.id) || !Number.isInteger(tab.windowId)
        || !isModifierMask(message.modifiers)
        || (message.pickerOpen !== undefined && typeof message.pickerOpen !== "boolean")) {
        return { ok: false, error: "invalid-shortcut" };
      }
      return queueShortcut(() => controller.finishShortcut(tab, message.modifiers, {
        keepTraversal: message.pickerOpen === true || sessions.has(tab.id),
      }));
    }
    if (message.type === "mru-move") {
      if (message.direction !== "back" && message.direction !== "forward") return { ok: false, error: "invalid-direction" };
      const { modifiers = 0, commit = true } = message;
      if (!isModifierMask(modifiers) || typeof commit !== "boolean" || (!commit && modifiers === 0)) {
        return { ok: false, error: "invalid-shortcut" };
      }
      return queueShortcut(async () => {
        const tab = await getSource(sender);
        if (!tab) return { ok: false, error: "page-unavailable" };
        return controller.handleMove(message.direction, tab, { modifiers, commit });
      });
    }
    const tab = await getSource(sender, { requireActive: message.type !== "mru-config" });
    if (!tab) return { ok: false, error: "page-unavailable" };
    if (message.type === "mru-config") return { ok: true, ...await readInputSettings() };
    if (message.type === "mru-select") {
      const selection = message.selection;
      if (!selection || selection.sourceTabId !== tab.id
        || (selection.mode !== undefined && selection.mode !== "mru" && selection.mode !== "tabs")
        || !Number.isInteger(selection.generation) || !Number.isInteger(selection.targetTabId)) {
        return { ok: false, error: "invalid-selection" };
      }
      return controller.selectCandidate(selection, tab);
    }
    if (message.direction !== "back" && message.direction !== "forward") return { ok: false, error: "invalid-direction" };
    const mode = message.mode ?? "mru";
    if (mode !== "mru" && mode !== "tabs") return { ok: false, error: "invalid-mode" };
    return controller.getCandidates(message.direction, tab, mode, {
      fresh: isPressId(message.pressId) && sessions.get(tab.id)?.pressId !== message.pressId,
    });
  }

  async function refreshExistingPages(inject) {
    const tabs = await browser.tabs.query({});
    const checkAccess = inject ? createPageInputAccessCheck(browser) : null;
    const results = await Promise.allSettled(tabs.filter((tab) => /^https?:\/\//i.test(tab.url ?? "")).map(async (tab) => {
      const shouldInject = checkAccess !== null && await checkAccess(tab);
      // Existing frames refresh first; newly injected frames load their own configuration.
      try { await browser.tabs.sendMessage(tab.id, { type: "mru-input-refresh" }); }
      catch { /* A restricted or navigating page can have no content-script receiver. */ }
      if (shouldInject) {
        await browser.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, files: INPUT_FILES });
      }
    }));
    if (results.some((result) => result.status === "rejected")) {
      console.warn("tabuchan: page input injection failed");
    }
  }

  function start() {
    if (started) return;
    started = true;
    browser.runtime.onConnect.addListener(connectPicker);
    browser.storage.onChanged?.addListener((changes, areaName) => {
      if (areaName === "local" && (Object.hasOwn(changes, "mruSettings") || Object.hasOwn(changes, "mruShortcuts"))) {
        configRead = null;
      }
    });
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!MESSAGE_TYPES.has(message?.type)) return;
      handleMessage(message, sender).then(sendResponse).catch(() => sendResponse({ ok: false, error: "input-unavailable" }));
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
