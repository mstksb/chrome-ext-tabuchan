import { isValidShortcut, sameShortcut } from "./shortcuts.js";

// Apply an edit to freshly read bindings without changing the caller's snapshot.
export function changeShortcut(shortcuts, target, binding = null) {
  const { direction } = target ?? {};
  if (!["back", "forward"].includes(direction) || !Number.isInteger(target.index)
    || target.index < -1 || (binding !== null && !isValidShortcut(binding))) {
    return { ok: false, error: "invalid-shortcut" };
  }
  const index = target.index < 0 ? -1
    : shortcuts[direction].findIndex((item) => target.binding && sameShortcut(item, target.binding));
  if (target.index >= 0 && index < 0) return { ok: false, error: "stale-shortcut" };
  if (binding) {
    const duplicate = Object.entries(shortcuts).some(([name, bindings]) => bindings.some((item, itemIndex) =>
      (name !== direction || itemIndex !== index) && sameShortcut(item, binding)));
    if (duplicate) return { ok: false, error: "duplicate-shortcut" };
  } else if (index < 0) {
    return { ok: false, error: "invalid-shortcut" };
  } else if (shortcuts[direction].length === 1) {
    return { ok: false, error: "last-shortcut" };
  }
  const result = {
    back: shortcuts.back.map((item) => ({ ...item })),
    forward: shortcuts.forward.map((item) => ({ ...item })),
  };
  if (!binding) result[direction].splice(index, 1);
  else if (index < 0) result[direction].push({ ...binding });
  else result[direction][index] = { ...binding };
  return { ok: true, shortcuts: result };
}
