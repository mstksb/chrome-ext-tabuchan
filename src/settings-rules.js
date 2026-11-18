(() => {
  const DEFAULT_HOLD_DELAY_MS = 500;
  const MIN_HOLD_DELAY_MS = 200;
  const MAX_HOLD_DELAY_MS = 2000;
  const HOLD_DELAY_STEP_MS = 100;
  const DEFAULT_MAX_PAST_TABS = 10;
  const MIN_PAST_TABS = 10;
  const MAX_PAST_TABS = 30;
  const DEFAULT_SEARCH_MATCH_MODE = "contains";

  function validDelay(value) {
    return Number.isInteger(value) && value >= MIN_HOLD_DELAY_MS && value <= MAX_HOLD_DELAY_MS
      && value % HOLD_DELAY_STEP_MS === 0;
  }

  function validCount(value) {
    return Number.isInteger(value) && value >= MIN_PAST_TABS && value <= MAX_PAST_TABS;
  }

  function validSearchMatchMode(value) {
    return value === "contains" || value === "prefix";
  }

  function normalizeSettings(value) {
    return {
      holdDelayMs: validDelay(value?.holdDelayMs) ? value.holdDelayMs : DEFAULT_HOLD_DELAY_MS,
      maxPastTabs: validCount(value?.maxPastTabs) ? value.maxPastTabs : DEFAULT_MAX_PAST_TABS,
      skipUnavailableTabs: typeof value?.skipUnavailableTabs === "boolean" ? value.skipUnavailableTabs : true,
      searchMatchMode: validSearchMatchMode(value?.searchMatchMode) ? value.searchMatchMode : DEFAULT_SEARCH_MATCH_MODE,
    };
  }

  function validateSettings(value) {
    if (!validDelay(value?.holdDelayMs) || !validCount(value?.maxPastTabs)
      || typeof value?.skipUnavailableTabs !== "boolean" || !validSearchMatchMode(value?.searchMatchMode)) {
      return { ok: false, error: "invalid-settings" };
    }
    return { ok: true, settings: normalizeSettings(value) };
  }

  globalThis.MruSettingsRules = Object.freeze({
    DEFAULT_HOLD_DELAY_MS, MIN_HOLD_DELAY_MS, MAX_HOLD_DELAY_MS, HOLD_DELAY_STEP_MS,
    DEFAULT_MAX_PAST_TABS, MIN_PAST_TABS, MAX_PAST_TABS, DEFAULT_SEARCH_MATCH_MODE, normalizeSettings, validateSettings,
  });
})();
