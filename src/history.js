import "./settings-rules.js";

const { DEFAULT_MAX_PAST_TABS } = globalThis.MruSettingsRules;

function moveToFront(tabIds, tabId, maxPastTabs = DEFAULT_MAX_PAST_TABS) {
  return [tabId, ...tabIds.filter((id) => id !== tabId)].slice(0, maxPastTabs + 1);
}

export function createWindowState(windowId, activeTabId = null, maxPastTabs = DEFAULT_MAX_PAST_TABS) {
  return {
    windowId,
    mruTabIds: activeTabId === null ? [] : [activeTabId],
    activeTabId,
    maxPastTabs,
    traversal: null,
    tabListSnapshot: null,
    generation: 0,
  };
}

export function commitActivation(state, tabId, { keepTraversal = false } = {}) {
  const nextState = {
    ...state,
    mruTabIds: moveToFront(state.mruTabIds, tabId, state.maxPastTabs),
    activeTabId: tabId,
  };
  if (keepTraversal && state.traversal) {
    const { shortcut, ...traversal } = state.traversal;
    return { ...nextState, traversal: { ...traversal, committed: true } };
  }
  return { ...nextState, traversal: null, tabListSnapshot: null, generation: state.generation + 1 };
}

export function observeActivation(state, tabId, { internal = false } = {}) {
  if (!internal && state.activeTabId !== tabId) return commitActivation(state, tabId);
  if (state.activeTabId === tabId && (state.traversal?.shortcut || state.mruTabIds[0] === tabId)) return state;
  return {
    ...state,
    mruTabIds: moveToFront(state.mruTabIds, tabId, state.maxPastTabs),
    activeTabId: tabId,
  };
}

export function beginOrMove(state, direction) {
  if (direction !== "back" && direction !== "forward") {
    throw new TypeError("History direction must be back or forward");
  }

  let nextState = state;

  if (state.traversal === null) {
    if (direction === "forward" || state.activeTabId === null) {
      return { state, targetTabId: null };
    }

    const tabIds = moveToFront(state.mruTabIds, state.activeTabId, state.maxPastTabs);

    if (tabIds.length < 2) {
      return { state, targetTabId: null };
    }

    const generation = state.generation + 1;
    nextState = {
      ...state,
      generation,
      tabListSnapshot: null,
      traversal: { tabIds, cursor: 0, generation },
    };
  }

  const { tabIds, cursor } = nextState.traversal;
  const targetCursor = cursor + (direction === "back" ? 1 : -1);

  if (targetCursor < 0 || targetCursor >= tabIds.length) {
    return { state: nextState, targetTabId: null };
  }

  return { state: nextState, targetTabId: tabIds[targetCursor] };
}

export function confirmMove(state, targetTabId) {
  const nextState = observeActivation(state, targetTabId, { internal: true });
  const cursor = state.traversal?.tabIds.indexOf(targetTabId) ?? -1;

  if (cursor < 0) {
    return {
      ...nextState,
      traversal: null,
      tabListSnapshot: null,
      generation: state.generation + 1,
    };
  }

  return {
    ...nextState,
    traversal: { ...state.traversal, cursor },
  };
}

export function previewMove(state, targetTabId, modifiers) {
  const cursor = state.traversal.tabIds.indexOf(targetTabId);
  return {
    ...state,
    activeTabId: targetTabId,
    traversal: {
      ...state.traversal,
      cursor,
      shortcut: { modifiers, sourceTabId: state.activeTabId },
    },
  };
}

export function removeTab(state, tabId) {
  const mruTabIds = state.mruTabIds.filter((id) => id !== tabId);

  if (state.activeTabId === tabId) {
    return {
      ...state,
      mruTabIds,
      activeTabId: null,
      traversal: null,
      tabListSnapshot: null,
      generation: state.generation + 1,
    };
  }

  if (state.traversal === null) {
    return { ...state, mruTabIds };
  }

  const tabIds = state.traversal.tabIds.filter((id) => id !== tabId);
  const cursor = tabIds.indexOf(state.activeTabId);

  if (tabIds.length < 2 || cursor < 0) {
    return {
      ...state,
      mruTabIds,
      traversal: null,
      tabListSnapshot: null,
      generation: state.generation + 1,
    };
  }

  return {
    ...state,
    mruTabIds,
    traversal: { ...state.traversal, tabIds, cursor },
  };
}

export function setHistoryLimit(state, maxPastTabs) {
  if ((state.maxPastTabs ?? DEFAULT_MAX_PAST_TABS) === maxPastTabs) return state;
  const mruTabIds = state.traversal?.shortcut
    ? moveToFront(state.mruTabIds, state.activeTabId, maxPastTabs)
    : state.mruTabIds.slice(0, maxPastTabs + 1);
  return {
    ...state,
    maxPastTabs,
    mruTabIds,
    traversal: null,
    tabListSnapshot: null,
    pendingSwitch: null,
    generation: state.generation + 1,
  };
}
