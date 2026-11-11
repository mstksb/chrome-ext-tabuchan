const modifierNames = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
const reservedKeys = new Set([
  "Escape", "Esc", "Tab", "Enter", "NumpadEnter",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Control", "Alt", "Shift", "Meta", "OS", "AltGraph", "Fn", "FnLock",
  "CapsLock", "NumLock", "ScrollLock", "Dead", "Process", "Unidentified",
]);
const modifierCode = /^(?:Control|Alt|Shift|Meta|OS)(?:Left|Right)$/;

function defaultsFor(platform) {
  const binding = {
    code: "KeyJ",
    key: "J",
    ctrlKey: platform === "mac",
    altKey: platform !== "mac",
    shiftKey: true,
    metaKey: false,
  };
  return { back: [binding], forward: [{ ...binding, code: "KeyK", key: "K" }] };
}

export function isValidShortcut(binding) {
  return Boolean(binding && typeof binding === "object" && !Array.isArray(binding)
    && typeof binding.code === "string" && binding.code.length > 0 && binding.code.length <= 64
    && binding.code.trim() === binding.code && !/[\s\u0000-\u001f\u007f]/.test(binding.code)
    && typeof binding.key === "string" && binding.key.length > 0 && binding.key.length <= 64
    && !/[\u0000-\u001f\u007f]/.test(binding.key)
    && !reservedKeys.has(binding.code) && !reservedKeys.has(binding.key)
    && !modifierCode.test(binding.code)
    && modifierNames.every((name) => typeof binding[name] === "boolean")
    && (binding.ctrlKey || binding.altKey || binding.metaKey));
}

export function sameShortcut(first, second) {
  return first.code === second.code && modifierNames.every((name) => first[name] === second[name]);
}

function copyBinding(binding) {
  return {
    code: binding.code,
    key: binding.key,
    ctrlKey: binding.ctrlKey,
    altKey: binding.altKey,
    shiftKey: binding.shiftKey,
    metaKey: binding.metaKey,
  };
}

export function normalizeShortcuts(value, platform) {
  const defaults = defaultsFor(platform);
  const result = {};
  for (const direction of ["back", "forward"]) {
    const stored = Array.isArray(value?.[direction]) ? value[direction] : [value?.[direction]];
    const bindings = [];
    for (const binding of stored) {
      if (isValidShortcut(binding) && !bindings.some((item) => sameShortcut(item, binding))) {
        bindings.push(copyBinding(binding));
      }
    }
    result[direction] = bindings.length > 0 ? bindings : defaults[direction];
  }
  const duplicated = result.back.some((back) => result.forward.some((forward) => sameShortcut(back, forward)));
  return duplicated ? defaults : result;
}

export function formatShortcut(binding) {
  if (!isValidShortcut(binding)) {
    return globalThis.chrome?.i18n?.getMessage("shortcut_not_set") || "Not set";
  }
  const labels = [];
  if (binding.ctrlKey) labels.push("Control");
  if (binding.altKey) labels.push("Alt");
  if (binding.shiftKey) labels.push("Shift");
  if (binding.metaKey) labels.push("Meta");
  const character = /^(?:Key|Digit)([A-Z0-9])$/.exec(binding.code);
  const keyLabel = character?.[1] ?? (binding.code === "Space" ? "Space" : binding.key);
  labels.push(keyLabel);
  return labels.join("+");
}

export async function readShortcuts(browser) {
  let platform = "";
  let value;
  try {
    platform = (await browser.runtime.getPlatformInfo()).os;
  } catch {
    // Keep the non-macOS defaults when platform information is unavailable.
  }
  try {
    value = (await browser.storage.local.get("mruShortcuts")).mruShortcuts;
  } catch {
    // A malformed or unreadable setting must not prevent input initialization.
  }
  return normalizeShortcuts(value, platform);
}
