(() => {
  if (globalThis.MruPressState) return;

  const threshold = 1000;

  function create(holdDelayMs = threshold) {
    const delay = Number.isFinite(holdDelayMs) && holdDelayMs > 0 ? holdDelayMs : threshold;
    let press = null;

    return {
      start(direction, now) {
        if (press !== null) return null;
        press = { direction, startedAt: now, held: true, opened: false };
        return { type: "start", direction };
      },

      hold(now) {
        if (!press || !press.held || press.opened || now - press.startedAt < delay) {
          return null;
        }
        press.opened = true;
        return { type: "list", direction: press.direction };
      },

      release(now) {
        if (!press || !press.held) return null;
        press.held = false;
        if (press.opened) return null;
        const action = {
          type: now - press.startedAt >= delay ? "list" : "tap",
          direction: press.direction,
        };
        if (action.type === "list") press.opened = true;
        else press = null;
        return action;
      },

      cancel() {
        press = null;
      },

      snapshot() {
        return press ? { ...press } : null;
      },
    };
  }

  globalThis.MruPressState = Object.freeze({ create, threshold });
})();
