import { readShortcuts } from "./shortcuts.js";

export const DEFAULT_HOLD_DELAY_MS = 1000;
export const MIN_HOLD_DELAY_MS = 500;
export const MAX_HOLD_DELAY_MS = 2000;
export const HOLD_DELAY_STEP_MS = 100;
export const DEFAULT_MAX_PAST_TABS = 10;
export const MIN_PAST_TABS = 10;
export const MAX_PAST_TABS = 30;

export function normalizeSettings(value) {
  const validDelay = Number.isInteger(value?.holdDelayMs)
    && value.holdDelayMs >= MIN_HOLD_DELAY_MS && value.holdDelayMs <= MAX_HOLD_DELAY_MS
    && value.holdDelayMs % HOLD_DELAY_STEP_MS === 0;
  const validCount = Number.isInteger(value?.maxPastTabs)
    && value.maxPastTabs >= MIN_PAST_TABS && value.maxPastTabs <= MAX_PAST_TABS;
  return {
    holdDelayMs: validDelay ? value.holdDelayMs : DEFAULT_HOLD_DELAY_MS,
    maxPastTabs: validCount ? value.maxPastTabs : DEFAULT_MAX_PAST_TABS,
    skipUnavailableTabs: typeof value?.skipUnavailableTabs === "boolean" ? value.skipUnavailableTabs : true,
  };
}

export async function readSettings(browser) {
  const shortcutsPromise = readShortcuts(browser);
  let stored;
  try {
    stored = (await browser.storage.local.get("mruSettings")).mruSettings;
  } catch {
    // Use defaults if the settings are unavailable or have not been saved yet.
  }
  return { ...normalizeSettings(stored), shortcuts: await shortcutsPromise };
}
