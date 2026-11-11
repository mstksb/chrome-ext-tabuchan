import {
  formatShortcut,
  isValidShortcut,
  normalizeShortcuts,
  sameShortcut,
} from "./shortcuts.js";
import { normalizeSettings } from "./settings.js";

document.documentElement.lang = chrome.i18n.getMessage("options_language_code") || "en";
for (const element of document.querySelectorAll("[data-i18n]")) {
  const message = chrome.i18n.getMessage(element.dataset.i18n);
  if (message) element.textContent = message;
}
for (const attribute of ["aria-label", "placeholder", "title"]) {
  for (const element of document.querySelectorAll(`[data-i18n-${attribute}]`)) {
    const message = chrome.i18n.getMessage(element.getAttribute(`data-i18n-${attribute}`));
    if (message) element.setAttribute(attribute, message);
  }
}

const shortcutList = document.querySelector(".shortcut-list");
const shortcutStatus = document.querySelector("#shortcut-status");
const behaviorForm = document.querySelector("#behavior-settings");
const holdDelayInput = document.querySelector("#hold-delay");
const maxPastTabsInput = document.querySelector("#max-past-tabs");
const skipUnavailableTabsInput = document.querySelector("#skip-unavailable-tabs");
const saveSettingsButton = document.querySelector("#save-settings");
const settingsStatus = document.querySelector("#settings-status");
const permissionStatus = document.querySelector("#permission-status");
const permissionIndicator = document.querySelector("#permission-indicator");
const grantPermissionButton = document.querySelector("#grant-permission");
const websiteOrigins = ["http://*/*", "https://*/*"];
let currentShortcuts;
let capture = null;
let saving = false;
let refreshVersion = 0;
let settingsDirty = false;

document.querySelector("#version").textContent = "v" + chrome.runtime.getManifest().version;

function showShortcutStatus(text, state = "ready") {
  shortcutStatus.textContent = text;
  shortcutStatus.dataset.state = state;
}

function updateControls() {
  for (const button of shortcutList.querySelectorAll("button")) {
    const direction = button.dataset.direction;
    const index = Number(button.dataset.index);
    const recording = capture?.direction === direction && capture.index === index;
    button.disabled = saving || !currentShortcuts
      || (button.dataset.action === "delete" && currentShortcuts[direction].length === 1);
    if (button.dataset.action === "record") {
      const label = recording ? "options_recording" : index < 0 ? "options_add" : "options_change";
      button.textContent = chrome.i18n.getMessage(label);
      button.setAttribute("aria-pressed", String(recording));
    }
  }
  saveSettingsButton.disabled = saving || !currentShortcuts;
  holdDelayInput.disabled = saving || !currentShortcuts;
  maxPastTabsInput.disabled = saving || !currentShortcuts;
  skipUnavailableTabsInput.disabled = saving || !currentShortcuts;
}

function makeButton(direction, index, action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-secondary record-button";
  button.dataset.direction = direction;
  button.dataset.index = String(index);
  button.dataset.action = action;
  button.textContent = label;
  const name = chrome.i18n.getMessage(direction === "back" ? "options_back" : "options_forward");
  const accessibleLabel = index < 0
    ? chrome.i18n.getMessage("options_add_shortcut_label", name)
    : chrome.i18n.getMessage("options_shortcut_action_label", [name, String(index + 1), label]);
  button.setAttribute("aria-label", accessibleLabel);
  button.setAttribute("aria-describedby", "shortcut-status");
  return button;
}

function renderShortcuts(shortcuts) {
  currentShortcuts = shortcuts;
  for (const direction of ["back", "forward"]) {
    const container = document.querySelector(`#${direction}-bindings`);
    container.replaceChildren();
    shortcuts[direction].forEach((binding, index) => {
      const row = document.createElement("div");
      row.className = "binding-row";
      const key = document.createElement("kbd");
      key.textContent = formatShortcut(binding);
      key.dataset.state = "assigned";
      if (index === 0) key.id = `${direction}-shortcut`;
      const record = makeButton(direction, index, "record", chrome.i18n.getMessage("options_change"));
      if (index === 0) record.id = `record-${direction}`;
      row.append(key, record, makeButton(direction, index, "delete", chrome.i18n.getMessage("options_delete")));
      container.append(row);
    });
    const add = makeButton(direction, -1, "record", chrome.i18n.getMessage("options_add"));
    add.id = `add-${direction}`;
    container.append(add);
  }
  updateControls();
}

function cancelCapture() {
  if (!capture) return;
  const { direction, index } = capture;
  capture = null;
  updateControls();
  showShortcutStatus(chrome.i18n.getMessage("options_capture_cancelled"));
  shortcutList.querySelector(`[data-direction="${direction}"][data-index="${index}"][data-action="record"]`)?.focus();
}

function startCapture(direction, index) {
  if (!currentShortcuts || saving) return;
  if (capture?.direction === direction && capture.index === index) {
    cancelCapture();
    return;
  }
  capture = { direction, index, binding: currentShortcuts[direction][index] };
  updateControls();
  const label = chrome.i18n.getMessage(direction === "back" ? "options_back" : "options_forward");
  showShortcutStatus(chrome.i18n.getMessage("options_capture_prompt", label), "attention");
}

async function changeShortcut(target, binding = null) {
  saving = true;
  refreshVersion += 1;
  capture = null;
  updateControls();
  try {
    await navigator.locks.request("mru-shortcut-settings", async () => {
      const [platform, stored] = await Promise.all([
        chrome.runtime.getPlatformInfo(),
        chrome.storage.local.get("mruShortcuts"),
      ]);
      const latest = normalizeShortcuts(stored.mruShortcuts, platform.os);
      const { direction } = target;
      const index = target.index < 0 ? -1
        : latest[direction].findIndex((item) => sameShortcut(item, target.binding));
      if (target.index >= 0 && index < 0) {
        renderShortcuts(latest);
        showShortcutStatus(chrome.i18n.getMessage("options_settings_changed"), "error");
        return;
      }
      if (binding) {
        const duplicate = Object.entries(latest).some(([name, bindings]) => bindings.some((item, itemIndex) =>
          (name !== direction || itemIndex !== index) && sameShortcut(item, binding)));
        if (duplicate) {
          showShortcutStatus(chrome.i18n.getMessage("options_duplicate_shortcut"), "error");
          return;
        }
        if (index < 0) latest[direction].push(binding);
        else latest[direction][index] = binding;
      } else {
        if (latest[direction].length === 1) {
          showShortcutStatus(chrome.i18n.getMessage("options_shortcut_required"), "error");
          return;
        }
        latest[direction].splice(index, 1);
      }
      await chrome.storage.local.set({ mruShortcuts: latest });
      renderShortcuts(latest);
      showShortcutStatus(chrome.i18n.getMessage(binding ? "options_shortcut_saved" : "options_shortcut_deleted"));
    });
  } catch {
    showShortcutStatus(chrome.i18n.getMessage("options_shortcut_save_error"), "error");
  } finally {
    saving = false;
    updateControls();
  }
}

function captureKey(event) {
  if (!capture) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (event.repeat || event.isComposing) return;
  if (event.code === "Escape" || event.key === "Escape") {
    cancelCapture();
    return;
  }
  if (["Control", "Alt", "Shift", "Meta", "AltGraph", "OS"].includes(event.key)) return;
  const binding = {
    code: event.code,
    key: event.key,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    shiftKey: event.shiftKey,
    metaKey: event.metaKey,
  };
  if (!isValidShortcut(binding)) {
    showShortcutStatus(chrome.i18n.getMessage("options_invalid_shortcut"), "error");
    return;
  }
  void changeShortcut(capture, binding);
}

async function refreshShortcuts(version) {
  try {
    const [platform, stored] = await Promise.all([
      chrome.runtime.getPlatformInfo(),
      chrome.storage.local.get(["mruShortcuts", "mruSettings"]),
    ]);
    if (version !== refreshVersion || saving) return;
    renderShortcuts(normalizeShortcuts(stored.mruShortcuts, platform.os));
    const settings = normalizeSettings(stored.mruSettings);
    if (!settingsDirty) {
      holdDelayInput.value = String(settings.holdDelayMs / 1000);
      maxPastTabsInput.value = String(settings.maxPastTabs);
      skipUnavailableTabsInput.checked = settings.skipUnavailableTabs;
    }
    holdDelayInput.disabled = false;
    maxPastTabsInput.disabled = false;
    skipUnavailableTabsInput.disabled = false;
    if (!capture) showShortcutStatus(chrome.i18n.getMessage("options_shortcut_ready"));
  } catch {
    if (version !== refreshVersion || saving) return;
    showShortcutStatus(chrome.i18n.getMessage("options_settings_load_error"), "error");
  }
}

async function refreshPermissions(version) {
  try {
    const allowed = await chrome.permissions.contains({ origins: websiteOrigins });
    if (version !== refreshVersion) return;
    permissionStatus.textContent = chrome.i18n.getMessage(allowed ? "options_permission_allowed" : "options_permission_limited");
    permissionIndicator.dataset.state = allowed ? "ready" : "attention";
    grantPermissionButton.hidden = allowed;
  } catch {
    if (version !== refreshVersion) return;
    permissionStatus.textContent = chrome.i18n.getMessage("options_permission_error");
    permissionIndicator.dataset.state = "error";
    grantPermissionButton.hidden = true;
  }
}

async function refreshSettings() {
  if (saving) return;
  const version = ++refreshVersion;
  await Promise.all([refreshShortcuts(version), refreshPermissions(version)]);
}

shortcutList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || saving || !currentShortcuts) return;
  const { direction, action } = button.dataset;
  const index = Number(button.dataset.index);
  if (action === "record") startCapture(direction, index);
  else void changeShortcut({ direction, index, binding: currentShortcuts[direction][index] });
});
behaviorForm.addEventListener("input", () => { settingsDirty = true; });
behaviorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (saving || !currentShortcuts || !behaviorForm.reportValidity()) return;
  cancelCapture();
  saving = true;
  refreshVersion += 1;
  updateControls();
  const settings = {
    holdDelayMs: Math.round(Number(holdDelayInput.value) * 1000),
    maxPastTabs: Number(maxPastTabsInput.value),
    skipUnavailableTabs: skipUnavailableTabsInput.checked,
  };
  try {
    await chrome.storage.local.set({ mruSettings: settings });
    settingsDirty = false;
    settingsStatus.textContent = chrome.i18n.getMessage("options_settings_saved");
    settingsStatus.dataset.state = "ready";
  } catch {
    settingsStatus.textContent = chrome.i18n.getMessage("options_settings_save_error");
    settingsStatus.dataset.state = "error";
  } finally {
    saving = false;
    updateControls();
  }
});
window.addEventListener("keydown", captureKey, true);
window.addEventListener("blur", cancelCapture);
window.addEventListener("focus", refreshSettings);
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const currentTab = await chrome.tabs.getCurrent();
    if (currentTab?.id === tabId) await refreshSettings();
  } catch {
    showShortcutStatus(chrome.i18n.getMessage("options_settings_refresh_error"), "error");
  }
});
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.mruShortcuts || changes.mruSettings)) void refreshSettings();
});
chrome.permissions.onAdded.addListener(refreshSettings);
chrome.permissions.onRemoved.addListener(refreshSettings);
grantPermissionButton.addEventListener("click", async () => {
  grantPermissionButton.disabled = true;
  try {
    const granted = await chrome.permissions.request({ origins: websiteOrigins });
    await refreshSettings();
    if (!granted) permissionStatus.textContent = chrome.i18n.getMessage("options_permission_denied");
  } catch {
    permissionStatus.textContent = chrome.i18n.getMessage("options_permission_request_error");
    permissionIndicator.dataset.state = "error";
  } finally {
    grantPermissionButton.disabled = false;
  }
});
void refreshSettings();
