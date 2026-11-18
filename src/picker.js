(() => {
  // The nonce identifies the two independently observed ends of this frame. It is not a secret.
  const translate = (key, substitutions) => chrome.i18n.getMessage(key, substitutions);
  document.documentElement.lang = translate("options_language_code");
  document.title = translate("picker_title");
  const nonce = crypto.randomUUID();
  const port = chrome.runtime.connect({ name: "mru-picker" });
  let closed = false;
  let sequence = 0;
  let maxListHeight;
  let reportedHeight;
  const pending = new Map();
  function close() {
    if (closed) return;
    closed = true;
    view.close();
    for (const resolve of pending.values()) resolve({ ok: false });
    pending.clear();
    window.parent.postMessage({ type: "mru-picker-closed", nonce }, "*");
  }
  function post(message) {
    try { port.postMessage(message); } catch { close(); }
  }
  const view = globalThis.MruPickerView.create(document, {
    translate,
    ensureContext: () => {
      try { if (!closed && chrome.runtime?.id) return true; } catch { /* Invalidated extension. */ }
      close();
      return false;
    },
    sendControl(action, details) {
      if (closed) return Promise.resolve({ ok: false });
      const requestId = ++sequence;
      return new Promise((resolve) => {
        pending.set(requestId, resolve);
        post({ type: "control", requestId, action, ...details });
      });
    },
  });
  port.onMessage.addListener((message) => {
    if (message.type === "ready") {
      window.parent.postMessage({ type: "mru-picker-ready", nonce }, "*");
    } else if (message.type === "display") {
      if (Number.isFinite(message.maxListHeight) && message.maxListHeight !== maxListHeight) {
        maxListHeight = message.maxListHeight;
        document.documentElement.style.setProperty("--picker-list-height", `${maxListHeight}px`);
      }
      view.update(message);
    } else if (message.type === "result") {
      pending.get(message.requestId)?.(message);
      pending.delete(message.requestId);
      if (!message.ok) close();
    } else if (message.type === "close") close();
  });
  port.onDisconnect.addListener(close);
  window.addEventListener("keydown", (event) => { view.handleKey(event); }, true);
  window.addEventListener("keyup", (event) => {
    event.stopImmediatePropagation();
    if (event.isTrusted && !closed) {
      const { MODIFIER_CODES, modifierMask } = globalThis.MruInputProtocol;
      if (MODIFIER_CODES[event.code]) post({ type: "modifiers", modifiers: modifierMask(event) });
    }
  }, true);
  window.addEventListener("blur", () => {
    if (!closed) post({ type: "control", requestId: ++sequence, action: "cancel" });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !closed) post({ type: "control", requestId: ++sequence, action: "cancel" });
  });
  new ResizeObserver(() => {
    if (closed || !view.root) return;
    const height = Math.ceil(view.root.getBoundingClientRect().height);
    if (height === reportedHeight) return;
    reportedHeight = height;
    post({ type: "resize", height });
  }).observe(document.body);
  post({ type: "hello", nonce });
})();
