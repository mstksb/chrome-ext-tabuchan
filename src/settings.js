import "./settings-rules.js";
import { getPlatform, normalizeShortcuts } from "./shortcuts.js";

export const {
  DEFAULT_HOLD_DELAY_MS, MIN_HOLD_DELAY_MS, MAX_HOLD_DELAY_MS, HOLD_DELAY_STEP_MS,
  DEFAULT_MAX_PAST_TABS, MIN_PAST_TABS, MAX_PAST_TABS, DEFAULT_SEARCH_MATCH_MODE, normalizeSettings, validateSettings,
} = globalThis.MruSettingsRules;

export async function readBehaviorSettings(browser) {
  let stored;
  try {
    stored = (await browser.storage.local.get("mruSettings")).mruSettings;
  } catch {
    // Use defaults if the settings are unavailable or have not been saved yet.
  }
  return normalizeSettings(stored);
}

export async function readSettings(browser, { strict = false } = {}) {
  const platformPromise = getPlatform(browser);
  let stored = {};
  try {
    stored = await browser.storage.local.get(["mruSettings", "mruShortcuts"]);
  } catch {
    if (strict) throw new Error("settings-unavailable");
    // A malformed or unreadable setting must not prevent input initialization.
  }
  return {
    ...normalizeSettings(stored.mruSettings),
    shortcuts: normalizeShortcuts(stored.mruShortcuts, await platformPromise),
  };
}
