(() => {
  if (globalThis.__mruTabSwitcherOverlay) {
    return;
  }
  globalThis.__mruTabSwitcherOverlay = true;

  const displayDuration = 1800;
  let latestRevision = -1;
  let hideTimer;
  let elements;

  function hide() {
    clearTimeout(hideTimer);
    elements?.host.remove();
    elements = undefined;
  }

  function createOverlay() {
    const host = document.createElement("div");
    host.id = "mru-tab-switcher-overlay";
    const hostStyle = {
      all: "initial",
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(440px, calc(100vw - 32px))",
      "z-index": "2147483647",
      "pointer-events": "none",
      "color-scheme": "light",
    };
    for (const [property, value] of Object.entries(hostStyle)) {
      host.style.setProperty(property, value, "important");
    }

    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      .card {
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        padding: 16px;
        border: 1px solid #c9d8ed;
        border-top: 3px solid #3869d4;
        border-radius: 14px;
        background: #fff;
        color: #17243b;
        box-shadow: 0 12px 36px #12233d30, 0 2px 6px #12233d14;
        font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: left;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        border: 1px solid #dbe5f3;
        border-radius: 10px;
        background: #f3f7fd;
      }
      img, svg { width: 24px; height: 24px; }
      [hidden] { display: none !important; }
      .content { min-width: 0; }
      .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 650; }
      .hint { margin-top: 3px; color: #53647c; font-size: 11px; }
      .position { color: #294f97; font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
      @media (prefers-color-scheme: dark) {
        .card { background: #172236; color: #f0f4fc; border-color: #3c5273; border-top-color: #85a9ff; box-shadow: 0 12px 36px #0006; }
        .icon { background: #24334d; border-color: #405675; }
        .hint { color: #bbcae0; }
        .position { color: #a7c3ff; }
      }
      @media (max-width: 380px) {
        .card { padding: 12px; gap: 10px; }
        .hint { font-size: 10px; }
      }
    `;

    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("role", "status");
    card.setAttribute("aria-live", "polite");
    card.setAttribute("aria-atomic", "true");

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    image.hidden = true;

    const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    fallback.setAttribute("viewBox", "0 0 24 24");
    fallback.setAttribute("fill", "none");
    const backTab = document.createElementNS("http://www.w3.org/2000/svg", "path");
    backTab.setAttribute("d", "M8 5h10a2 2 0 0 1 2 2v10");
    backTab.setAttribute("stroke", "#8099c5");
    backTab.setAttribute("stroke-width", "1.8");
    const frontTab = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    frontTab.setAttribute("x", "4");
    frontTab.setAttribute("y", "8");
    frontTab.setAttribute("width", "13");
    frontTab.setAttribute("height", "12");
    frontTab.setAttribute("rx", "2");
    frontTab.setAttribute("stroke", "#4777ce");
    frontTab.setAttribute("stroke-width", "1.8");
    fallback.append(backTab, frontTab);
    icon.append(image, fallback);

    const content = document.createElement("div");
    content.className = "content";
    const title = document.createElement("div");
    title.className = "title";
    const hint = document.createElement("div");
    hint.className = "hint";
    content.append(title, hint);
    const position = document.createElement("span");
    position.className = "position";
    card.append(icon, content, position);
    shadow.append(style, card);
    document.documentElement.append(host);
    return { host, image, fallback, title, hint, position };
  }

  function getIconUrl(value) {
    if (typeof value !== "string" || value.length === 0) {
      return null;
    }
    if (/^data:image\/(?:png|gif|jpeg|webp|avif|svg\+xml|x-icon|vnd\.microsoft\.icon)[;,]/i.test(value)) {
      return value;
    }
    try {
      const url = new URL(value);
      if (["http:", "https:", "chrome-extension:"].includes(url.protocol)) {
        return url.href;
      }
      if (url.protocol === "chrome:" && url.hostname === "favicon2") {
        return url.href;
      }
    } catch {
      return null;
    }
    return null;
  }

  function show(message) {
    if (!document.documentElement || document.visibilityState === "hidden") {
      return false;
    }
    latestRevision = message.revision;
    elements ??= createOverlay();
    const current = elements;
    current.title.textContent = typeof message.title === "string" && message.title.trim()
      ? message.title
      : chrome.i18n.getMessage("overlay_untitled");
    const back = message.backShortcut
      ? chrome.i18n.getMessage("overlay_back_shortcut", [message.backShortcut])
      : chrome.i18n.getMessage("overlay_back");
    const forward = message.forwardShortcut
      ? chrome.i18n.getMessage("overlay_forward_shortcut", [message.forwardShortcut])
      : chrome.i18n.getMessage("overlay_forward");
    current.hint.textContent = message.boundary
      ? chrome.i18n.getMessage("overlay_boundary")
      : chrome.i18n.getMessage("overlay_shortcuts", [back, forward]);
    const position = Number.isInteger(message.position) ? message.position : 0;
    const pastCount = Number.isInteger(message.pastCount) ? message.pastCount : 0;
    current.position.textContent = chrome.i18n.getMessage("overlay_position", [String(position), String(pastCount)]);
    current.image.hidden = true;
    current.fallback.removeAttribute("hidden");
    const iconUrl = getIconUrl(message.favIconUrl);
    if (iconUrl) {
      current.image.onload = () => {
        if (message.revision === latestRevision && elements === current && current.image.getAttribute("src") === iconUrl) {
          current.image.hidden = false;
          current.fallback.setAttribute("hidden", "");
        }
      };
      current.image.onerror = () => {
        if (message.revision === latestRevision && elements === current && current.image.getAttribute("src") === iconUrl) {
          current.image.hidden = true;
          current.fallback.removeAttribute("hidden");
        }
      };
      current.image.src = iconUrl;
    } else {
      current.image.removeAttribute("src");
    }
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, displayDuration);
    return true;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id && sender.id !== chrome.runtime.id) {
      return;
    }
    if (message?.type !== "mru-show") {
      return;
    }
    if (!Number.isFinite(message.revision) || message.revision < latestRevision) {
      sendResponse({ ok: false });
      return;
    }
    sendResponse({ ok: show(message) });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      hide();
    }
  });
})();
