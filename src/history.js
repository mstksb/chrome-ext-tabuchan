import { DEFAULT_MAX_PAST_TABS } from "./settings.js";

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
    generation: 0,
  };
}

export function observeActivation(state, tabId, { internal = false } = {}) {
  const externalSelection = !internal && state.activeTabId !== tabId;

  return {
    ...state,
    mruTabIds: moveToFront(state.mruTabIds, tabId, state.maxPastTabs),
    activeTabId: tabId,
    traversal: externalSelection ? null : state.traversal,
    generation: externalSelection ? state.generation + 1 : state.generation,
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
      generation: state.generation + 1,
    };
  }

  return {
    ...nextState,
    traversal: { ...state.traversal, cursor },
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
  return {
    ...state,
    maxPastTabs,
    mruTabIds: state.mruTabIds.slice(0, maxPastTabs + 1),
    traversal: null,
    tabListSnapshot: null,
    pendingSwitch: null,
    generation: state.generation + 1,
  };
}
