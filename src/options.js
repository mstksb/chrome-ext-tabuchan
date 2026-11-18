import {
  formatShortcut,
  getPlatform,
  isValidShortcut,
  normalizeShortcuts,
  sameShortcut,
} from "./shortcuts.js";
import {
  DEFAULT_HOLD_DELAY_MS, MIN_HOLD_DELAY_MS, MAX_HOLD_DELAY_MS, HOLD_DELAY_STEP_MS,
  DEFAULT_MAX_PAST_TABS, MIN_PAST_TABS, MAX_PAST_TABS, DEFAULT_SEARCH_MATCH_MODE, readSettings, validateSettings,
} from "./settings.js";
import { changeShortcut as applyShortcutChange } from "./shortcut-changes.js";

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
const searchMatchModeInput = document.querySelector("#search-match-mode");
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
let permissionsVersion = 0;
let refreshPending = false;
let refreshTask = null;
let permissionsTask = null;
let permissionsPending = false;
let settingsDirty = false;
let settingsReadFailed = false;
const currentTab = chrome.tabs.getCurrent().catch(() => null);

Object.assign(holdDelayInput, {
  min: String(MIN_HOLD_DELAY_MS / 1000), max: String(MAX_HOLD_DELAY_MS / 1000),
  step: String(HOLD_DELAY_STEP_MS / 1000), value: String(DEFAULT_HOLD_DELAY_MS / 1000),
});
Object.assign(maxPastTabsInput, {
  min: String(MIN_PAST_TABS), max: String(MAX_PAST_TABS), step: "1", value: String(DEFAULT_MAX_PAST_TABS),
});
searchMatchModeInput.value = DEFAULT_SEARCH_MATCH_MODE;

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
      button.textContent = chrome.i18n.getMessage(recording ? "options_recording" : index < 0 ? "options_add" : "options_change");
      button.setAttribute("aria-pressed", String(recording));
    }
  }
  saveSettingsButton.disabled = saving || !currentShortcuts;
  holdDelayInput.disabled = saving || !currentShortcuts;
  maxPastTabsInput.disabled = saving || !currentShortcuts;
  skipUnavailableTabsInput.disabled = saving || !currentShortcuts;
  searchMatchModeInput.disabled = saving || !currentShortcuts;
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
  button.setAttribute("aria-label", index < 0
    ? chrome.i18n.getMessage("options_add_shortcut_label", name)
    : chrome.i18n.getMessage("options_shortcut_action_label", [name, String(index + 1), label]));
  button.setAttribute("aria-describedby", "shortcut-status");
  return button;
}

function renderShortcuts(shortcuts) {
  if (currentShortcuts && ["back", "forward"].every((direction) =>
    currentShortcuts[direction].length === shortcuts[direction].length
      && currentShortcuts[direction].every((item, index) =>
        sameShortcut(item, shortcuts[direction][index]) && item.key === shortcuts[direction][index].key))) {
    return;
  }
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
  refreshPending = true;
  capture = null;
  updateControls();
  try {
    await navigator.locks.request("mru-shortcut-settings", async () => {
      const [platform, stored] = await Promise.all([
        getPlatform(chrome),
        chrome.storage.local.get("mruShortcuts"),
      ]);
      const latest = normalizeShortcuts(stored.mruShortcuts, platform);
      const result = applyShortcutChange(latest, target, binding);
      if (!result.ok) {
        const messages = {
          "stale-shortcut": "options_settings_changed",
          "duplicate-shortcut": "options_duplicate_shortcut",
          "last-shortcut": "options_shortcut_required",
          "invalid-shortcut": "options_shortcut_change_invalid",
        };
        renderShortcuts(latest);
        showShortcutStatus(chrome.i18n.getMessage(messages[result.error]), "error");
        return;
      }
      await chrome.storage.local.set({ mruShortcuts: result.shortcuts });
      renderShortcuts(result.shortcuts);
      showShortcutStatus(binding ? chrome.i18n.getMessage("options_shortcut_saved") : chrome.i18n.getMessage("options_shortcut_deleted"));
    });
  } catch {
    showShortcutStatus(chrome.i18n.getMessage("options_shortcut_save_error"), "error");
  } finally {
    saving = false;
    updateControls();
    await refreshSettings();
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
    const settings = await readSettings(chrome, { strict: true });
    if (version !== refreshVersion || saving) return;
    renderShortcuts(settings.shortcuts);
    if (!settingsDirty) {
      holdDelayInput.value = String(settings.holdDelayMs / 1000);
      maxPastTabsInput.value = String(settings.maxPastTabs);
      skipUnavailableTabsInput.checked = settings.skipUnavailableTabs;
      searchMatchModeInput.value = settings.searchMatchMode;
    }
    holdDelayInput.disabled = false;
    maxPastTabsInput.disabled = false;
    skipUnavailableTabsInput.disabled = false;
    searchMatchModeInput.disabled = false;
    if (!capture && (!shortcutStatus.textContent || settingsReadFailed)) {
      showShortcutStatus(chrome.i18n.getMessage("options_shortcut_ready"));
    }
    settingsReadFailed = false;
  } catch {
    if (version !== refreshVersion || saving) return;
    settingsReadFailed = true;
    showShortcutStatus(chrome.i18n.getMessage("options_settings_load_error"), "error");
  }
}

async function readPermissions(version) {
  try {
    const allowed = await chrome.permissions.contains({ origins: websiteOrigins });
    if (version !== permissionsVersion) return;
    permissionStatus.textContent = allowed
      ? chrome.i18n.getMessage("options_permission_allowed")
      : chrome.i18n.getMessage("options_permission_limited");
    permissionIndicator.dataset.state = allowed ? "ready" : "attention";
    grantPermissionButton.hidden = allowed;
  } catch {
    if (version !== permissionsVersion) return;
    permissionStatus.textContent = chrome.i18n.getMessage("options_permission_error");
    permissionIndicator.dataset.state = "error";
    grantPermissionButton.hidden = true;
  }
}

function refreshSettings() {
  refreshPending = true;
  refreshVersion += 1;
  if (saving) return Promise.resolve();
  if (!refreshTask) {
    refreshTask = Promise.resolve().then(async () => {
      while (refreshPending && !saving) {
        refreshPending = false;
        await refreshShortcuts(refreshVersion);
      }
    }).finally(() => {
      refreshTask = null;
      if (refreshPending && !saving) void refreshSettings();
    });
  }
  return refreshTask;
}

function refreshPermissions() {
  permissionsPending = true;
  permissionsVersion += 1;
  if (!permissionsTask) {
    permissionsTask = Promise.resolve().then(async () => {
      while (permissionsPending) {
        permissionsPending = false;
        await readPermissions(permissionsVersion);
      }
    }).finally(() => {
      permissionsTask = null;
      if (permissionsPending) void refreshPermissions();
    });
  }
  return permissionsTask;
}

function refreshAll() {
  return Promise.all([refreshSettings(), refreshPermissions()]);
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
  const result = validateSettings({
    holdDelayMs: Number(holdDelayInput.value) * 1000,
    maxPastTabs: Number(maxPastTabsInput.value),
    skipUnavailableTabs: skipUnavailableTabsInput.checked,
    searchMatchMode: searchMatchModeInput.value,
  });
  if (!result.ok) {
    settingsStatus.textContent = chrome.i18n.getMessage("options_settings_invalid");
    settingsStatus.dataset.state = "error";
    return;
  }
  saving = true;
  refreshVersion += 1;
  refreshPending = true;
  updateControls();
  try {
    await chrome.storage.local.set({ mruSettings: result.settings });
    settingsDirty = false;
    settingsStatus.textContent = chrome.i18n.getMessage("options_settings_saved");
    settingsStatus.dataset.state = "ready";
  } catch {
    settingsStatus.textContent = chrome.i18n.getMessage("options_settings_save_error");
    settingsStatus.dataset.state = "error";
  } finally {
    saving = false;
    updateControls();
    await refreshSettings();
  }
});
window.addEventListener("keydown", captureKey, true);
window.addEventListener("blur", cancelCapture);
window.addEventListener("focus", refreshAll);
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    if ((await currentTab)?.id === tabId) await refreshAll();
  } catch {
    showShortcutStatus(chrome.i18n.getMessage("options_settings_refresh_error"), "error");
  }
});
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.mruShortcuts || changes.mruSettings)) void refreshSettings();
});
chrome.permissions.onAdded.addListener(refreshPermissions);
chrome.permissions.onRemoved.addListener(refreshPermissions);
grantPermissionButton.addEventListener("click", async () => {
  grantPermissionButton.disabled = true;
  try {
    const granted = await chrome.permissions.request({ origins: websiteOrigins });
    await refreshPermissions();
    if (!granted) permissionStatus.textContent = chrome.i18n.getMessage("options_permission_denied");
  } catch {
    permissionStatus.textContent = chrome.i18n.getMessage("options_permission_request_error");
    permissionIndicator.dataset.state = "error";
  } finally {
    grantPermissionButton.disabled = false;
  }
});
void refreshAll();
