import {
  beginOrMove,
  commitActivation,
  confirmMove,
  createWindowState,
  observeActivation,
  previewMove,
  removeTab,
  setHistoryLimit,
} from "./history.js";
import { DEFAULT_MAX_PAST_TABS, readBehaviorSettings } from "./settings.js";
import { createPageInputAccessCheck } from "./tab-access.js";
import { createLegacyCommands } from "./legacy-command.js";

// Accept the provisional 0.3.0 state format, then apply the current limit on restore.
const MAX_SAVED_PAST_TABS = 100;

function isTabId(value) {
  return Number.isInteger(value) && value >= 0;
}

function isTabList(value) {
  return Array.isArray(value)
    && value.length <= MAX_SAVED_PAST_TABS + 1
    && value.every(isTabId)
    && new Set(value).size === value.length;
}

function isSavedWindow(value, windowId) {
  if (!value || value.windowId !== windowId || !isTabList(value.mruTabIds)
    || !(value.activeTabId === null || isTabId(value.activeTabId))
    || (value.maxPastTabs !== undefined && (!Number.isInteger(value.maxPastTabs)
      || value.maxPastTabs < 1 || value.maxPastTabs > MAX_SAVED_PAST_TABS))
    || value.mruTabIds.length > (value.maxPastTabs ?? DEFAULT_MAX_PAST_TABS) + 1
    || !Number.isInteger(value.generation) || value.generation < 0) {
    return false;
  }

  const traversal = value.traversal;
  return traversal === null || Boolean(traversal
    && isTabList(traversal.tabIds)
    && traversal.tabIds.length >= 2
    && Number.isInteger(traversal.cursor)
    && traversal.cursor >= 0
    && traversal.cursor < traversal.tabIds.length
    && traversal.tabIds[traversal.cursor] === value.activeTabId
    && traversal.generation === value.generation
    && traversal.tabIds.every((id) => value.mruTabIds.includes(id)));
}

function endTraversal(state) {
  return {
    ...state,
    traversal: null,
    pendingSwitch: null,
    tabListSnapshot: null,
    generation: state.generation + 1,
  };
}

function indexWindowTabs(allTabs) {
  const tabs = [];
  const tabsById = new Map();
  let activeTab = null;
  for (const tab of allTabs) {
    if (!isTabId(tab.id)) continue;
    tabs.push(tab);
    tabsById.set(tab.id, tab);
    if (tab.active && !activeTab) activeTab = tab;
  }
  return { tabs, tabsById, activeTab };
}

function reconcileTabs(state, { tabsById, activeTab }, internalTarget = null) {
  const trackedIds = new Set([...state.mruTabIds, ...(state.traversal?.tabIds ?? [])]);
  let nextState = state;

  for (const tabId of trackedIds) {
    if (!tabsById.has(tabId)) {
      nextState = removeTab(nextState, tabId);
    }
  }

  if (activeTab) {
    if (activeTab.id === internalTarget) return nextState;
    return observeActivation(nextState, activeTab.id);
  }

  if (nextState.activeTabId !== null) {
    return { ...endTraversal(nextState), activeTabId: null };
  }
  return nextState;
}

function restoreWindow(windowId, saved, snapshot, maxPastTabs) {
  const activeTabId = snapshot.activeTab?.id ?? null;
  if (!isSavedWindow(saved, windowId)) {
    return createWindowState(windowId, activeTabId, maxPastTabs);
  }

  let state = {
    windowId,
    mruTabIds: [...saved.mruTabIds],
    activeTabId: saved.activeTabId,
    maxPastTabs: saved.maxPastTabs ?? DEFAULT_MAX_PAST_TABS,
    traversal: saved.traversal ? {
      ...saved.traversal,
      tabIds: [...saved.traversal.tabIds],
    } : null,
    generation: saved.generation,
    pendingSwitch: null,
    tabListSnapshot: null,
  };

  const savedTabList = saved.tabListSnapshot;
  if (savedTabList?.sourceTabId === state.activeTabId && savedTabList.generation === state.generation
    && Array.isArray(savedTabList.tabIds) && savedTabList.tabIds.every(isTabId)
    && new Set(savedTabList.tabIds).size === savedTabList.tabIds.length) {
    state.tabListSnapshot = { ...savedTabList, tabIds: [...savedTabList.tabIds] };
  }

  if (saved.pendingSwitch) {
    state = endTraversal(state);
  }
  return reconcileTabs(setHistoryLimit(state, maxPastTabs), snapshot);
}

export function createController(browser) {
  let session = { schemaVersion: 1, revision: 0, windows: {} };
  let started = false;
  let initialization = Promise.resolve();
  let queue = Promise.resolve();
  let maxPastTabs = DEFAULT_MAX_PAST_TABS;
  let saveRequired = false;
  const inFlight = new Map();
  const expectedActivations = new Map();
  // Detect input-context changes before their queued history updates run.
  const inputRevisions = new Map();

  function reportFailure(kind) {
    console.warn(`tabuchan: ${kind}`);
  }

  const legacy = createLegacyCommands(browser, { reportFailure, getRevision: () => session.revision });

  function nextRevision() {
    session.revision = Math.max(Date.now(), session.revision + 1);
    return session.revision;
  }

  async function save() {
    saveRequired = true;
    await browser.storage.session.set({ mruState: structuredClone(session) });
    saveRequired = false;
  }

  function enqueue(task) {
    queue = queue.then(() => initialization).then(task).catch(() => {
      reportFailure("operation failed");
      return { ok: false, code: "operation-failed", error: browser.i18n.getMessage("controller_operation_failed") };
    });
    return queue;
  }

  async function synchronizeWindow(windowId, internalTarget = null, observedTabId = null) {
    const snapshot = indexWindowTabs(await browser.tabs.query({ windowId }));
    if (snapshot.tabs.length === 0) {
      delete session.windows[windowId];
      return { ...snapshot, state: null };
    }

    let state = session.windows[windowId] ?? createWindowState(windowId, null, maxPastTabs);
    if (observedTabId !== null && state.activeTabId !== observedTabId
      && snapshot.tabsById.has(observedTabId)) {
      state = observeActivation(state, observedTabId);
    }
    const updated = reconcileTabs(state, snapshot, internalTarget);
    session.windows[windowId] = updated;
    return { ...snapshot, state: updated };
  }

  async function initialize() {
    const [settings, allTabs, stored] = await Promise.all([
      readBehaviorSettings(browser),
      browser.tabs.query({}),
      Promise.resolve().then(() => browser.storage.session.get("mruState"))
        .then((value) => value.mruState).catch(() => {
          reportFailure("saved history unavailable");
          return undefined;
        }),
    ]);
    maxPastTabs = settings.maxPastTabs;
    const tabsByWindow = new Map();
    for (const tab of allTabs) {
      const tabs = tabsByWindow.get(tab.windowId);
      if (tabs) tabs.push(tab);
      else tabsByWindow.set(tab.windowId, [tab]);
    }

    const savedWindows = stored?.schemaVersion === 1 && stored.windows
      && typeof stored.windows === "object" && !Array.isArray(stored.windows) ? stored.windows : {};
    const windows = {};
    for (const [windowId, tabs] of tabsByWindow) {
      const snapshot = indexWindowTabs(tabs);
      if (snapshot.tabs.length === 0) continue;
      windows[windowId] = restoreWindow(
        windowId,
        savedWindows[windowId],
        snapshot,
        maxPastTabs,
      );
    }
    session = {
      schemaVersion: 1,
      revision: Number.isSafeInteger(stored?.revision) && stored.revision >= 0 ? stored.revision : 0,
      windows,
    };
    try {
      await save();
    } catch {
      reportFailure("initial history could not be saved");
    }
  }

  async function findAvailableMove(request, tabsById, direction, canUsePageInput) {
    if (request.targetTabId === null) return request;
    const { tabIds, cursor } = request.state.traversal;
    const step = direction === "back" ? 1 : -1;
    for (let index = cursor + step; index >= 0 && index < tabIds.length; index += step) {
      const candidate = tabsById.get(tabIds[index]);
      if (candidate && await canUsePageInput(candidate)) {
        return { ...request, targetTabId: candidate.id };
      }
    }
    return { ...request, targetTabId: null };
  }

  async function prepareSwitch(current, switchRequest, windowId, canUsePageInput) {
    const { kind, direction } = switchRequest;
    const selection = kind === "select" ? switchRequest.selection : null;
    const input = kind === "move" ? switchRequest.input : null;
    if (!current.state) {
      return { ok: false, error: browser.i18n.getMessage("controller_window_missing") };
    }
    if (input && (current.activeTab?.id !== input.sourceTabId
      || (inputRevisions.get(windowId) ?? 0) !== input.revision)) {
      return { ok: false, error: browser.i18n.getMessage("controller_move_cancelled") };
    }
    const tabListSelection = selection?.mode === "tabs";
    const snapshot = tabListSelection ? current.state.tabListSnapshot : current.state.traversal;
    if (selection && (current.activeTab?.id !== selection.sourceTabId
      || current.state.generation !== selection.generation
      || !snapshot?.tabIds.includes(selection.targetTabId)
      || (tabListSelection && (snapshot.sourceTabId !== selection.sourceTabId
        || snapshot.generation !== selection.generation))
      || (!tabListSelection && selection.targetTabId === selection.sourceTabId)
      || !current.tabsById.has(selection.targetTabId))) {
      return { ok: false, error: browser.i18n.getMessage("controller_candidates_updated") };
    }
    if (tabListSelection && selection.targetTabId === selection.sourceTabId) {
      const state = commitActivation(current.state, selection.targetTabId);
      return { request: { state, targetTabId: null } };
    }
    const traversal = current.state.traversal;
    let requestState = current.state;
    if (input && traversal && traversal.shortcut?.modifiers !== input.modifiers) {
      requestState = traversal.shortcut
        ? commitActivation(requestState, requestState.activeTabId) : endTraversal(requestState);
    }
    let request = selection
      ? { state: requestState, targetTabId: selection.targetTabId }
      : beginOrMove(requestState, direction);
    if (input?.skipUnavailableTabs) {
      request = await findAvailableMove(request, current.tabsById, direction, canUsePageInput);
    }
    if (input) {
      const refreshed = await synchronizeWindow(windowId);
      if (!refreshed.state || refreshed.activeTab?.id !== input.sourceTabId
        || refreshed.state.generation !== current.state.generation
        || (inputRevisions.get(windowId) ?? 0) !== input.revision) {
        await save();
        return { ok: false, error: browser.i18n.getMessage("controller_move_cancelled") };
      }
      if (request.targetTabId !== null && !refreshed.tabsById.has(request.targetTabId)) {
        return { retry: true };
      }
      if (refreshed.state !== current.state) {
        const state = request.state === requestState ? null : reconcileTabs(request.state, refreshed);
        requestState = requestState === current.state ? refreshed.state : reconcileTabs(requestState, refreshed);
        request = { ...request, state: state ?? requestState };
      }
    }
    if (input?.commit && request.targetTabId === null) {
      request.state = requestState.traversal?.shortcut
        ? commitActivation(requestState, requestState.activeTabId) : requestState;
    }
    return { request };
  }

  async function saveSwitchIntent(windowId, request, operation, activeTab) {
    session.windows[windowId] = {
      ...request.state,
      pendingSwitch: {
        operationId: session.revision,
        generation: operation.generation,
        fromTabId: request.state.activeTabId,
        targetTabId: request.targetTabId,
      },
    };

    try {
      await save();
      return { ok: true };
    } catch {
      session.windows[windowId] = { ...request.state, pendingSwitch: null };
      reportFailure("history could not be saved before switching");
      if (activeTab) await legacy.showStatus(activeTab, true, browser.i18n.getMessage("controller_history_save_status"));
      return { ok: false, error: browser.i18n.getMessage("controller_history_save_failed") };
    }
  }

  async function activateTarget(windowId, operation) {
    let updateFailed = false;
    const expected = expectedActivations.get(windowId) ?? [];
    expected.push(operation);
    expectedActivations.set(windowId, expected);
    try {
      await browser.tabs.update(operation.targetTabId, { active: true });
    } catch {
      updateFailed = true;
      const index = expected.indexOf(operation);
      if (index >= 0) expected.splice(index, 1);
    }

    return updateFailed;
  }

  async function reconcileSwitch(windowId, operation, updateFailed) {
    const internalTarget = operation.interrupted || updateFailed ? null : operation.targetTabId;
    const result = await synchronizeWindow(windowId, internalTarget);
    if (!result.state) {
      await save();
      return { result, succeeded: false, saved: true };
    }

    const succeeded = !updateFailed && !operation.interrupted
      && result.activeTab?.id === operation.targetTabId
      && result.state.generation === operation.generation;
    let updated = result.state;
    if (result.activeTab?.id === internalTarget) {
      if (!succeeded || operation.commit) updated = commitActivation(updated, internalTarget);
      else if (operation.modifiers) updated = previewMove(updated, internalTarget, operation.modifiers);
      else updated = confirmMove(updated, internalTarget);
    }
    session.windows[windowId] = { ...updated, pendingSwitch: null };

    let saved = true;
    try {
      await save();
    } catch {
      saved = false;
      reportFailure("history could not be saved after switching");
    }

    operation.confirmed = succeeded && saved;
    if (operation.confirmed) operation.generation = updated.generation;
    return { result, succeeded, saved };
  }

  // Each entry point declares its intent; selection is never encoded as a direction.
  async function executeSwitch(switchRequest) {
    const { kind, windowId: suppliedWindowId } = switchRequest;
    const selection = kind === "select" ? switchRequest.selection : null;
    const input = kind === "move" ? switchRequest.input : null;
    const windowId = suppliedWindowId ?? (await browser.windows.getLastFocused({ populate: false })).id;
    if (!isTabId(windowId)) {
      return { ok: false, error: browser.i18n.getMessage("controller_window_read_failed") };
    }

    const quiet = kind !== "legacy";
    const canUsePageInput = createPageInputAccessCheck(browser);
    for (let attempt = 0; attempt <= maxPastTabs; attempt += 1) {
      const previousState = session.windows[windowId];
      const current = await synchronizeWindow(windowId);
      const prepared = await prepareSwitch(current, switchRequest, windowId, canUsePageInput);
      if (prepared.retry) continue;
      if (!prepared.request) return prepared;
      const { request } = prepared;
      const stateChanged = current.state !== previousState || request.state !== current.state
        || session.windows[windowId] !== request.state;
      session.windows[windowId] = request.state;

      if (request.targetTabId === null) {
        if (stateChanged || saveRequired) {
          nextRevision();
          await save();
        }
        if (!quiet) await legacy.showOverlay(current.activeTab, request.state, true);
        return { ok: true };
      }

      const preview = input && !input.commit && await canUsePageInput(current.tabsById.get(request.targetTabId));
      nextRevision();
      const operation = {
        targetTabId: request.targetTabId,
        generation: request.state.generation,
        interrupted: false,
        commit: Boolean(selection || (input && !preview)),
        modifiers: preview ? input.modifiers : 0,
      };
      inFlight.set(windowId, operation);
      try {
        const intent = await saveSwitchIntent(windowId, request, operation, current.activeTab);
        if (!intent.ok) return intent;
        if (selection || input) {
          const currentTabs = await browser.tabs.query({ windowId });
          const sourceTabId = selection?.sourceTabId ?? input.sourceTabId;
          const sourceActive = currentTabs.some((tab) => tab.id === sourceTabId && tab.active);
          const targetPresent = currentTabs.some((tab) => tab.id === request.targetTabId);
          if (!sourceActive || (selection && !targetPresent)
            || (input && (inputRevisions.get(windowId) ?? 0) !== input.revision)) {
            operation.interrupted = true;
          }
        }
        if (operation.interrupted) {
          session.windows[windowId] = endTraversal(session.windows[windowId]);
          await synchronizeWindow(windowId);
          await save();
          return { ok: false, error: browser.i18n.getMessage("controller_selection_cancelled") };
        }

        const updateFailed = await activateTarget(windowId, operation);
        if (operation.interrupted) {
          session.windows[windowId] = endTraversal(session.windows[windowId]);
        }
        const { result, succeeded, saved } = await reconcileSwitch(windowId, operation, updateFailed);
        if (!result.state) return { ok: false, error: browser.i18n.getMessage("controller_window_missing") };
        const targetDisappeared = !result.tabsById.has(request.targetTabId);
        if (!selection && updateFailed && targetDisappeared && !operation.interrupted && saved) {
          continue;
        }
        if (!quiet && result.activeTab && (succeeded || !updateFailed)) {
          await legacy.showOverlay(result.activeTab, session.windows[windowId], false);
        }
        if (!saved && result.activeTab) {
          await legacy.showStatus(result.activeTab, true, browser.i18n.getMessage("controller_history_save_status"));
        }
        if (updateFailed && !targetDisappeared) {
          reportFailure("tab could not be switched");
          if (result.activeTab) {
            await legacy.showStatus(result.activeTab, true, browser.i18n.getMessage("controller_tab_switch_failed"));
          }
        }
        if (succeeded) {
          return { ok: true };
        }
        return { ok: false, error: browser.i18n.getMessage("controller_candidate_retry") };
      } finally {
        inFlight.delete(windowId);
      }
    }
    return { ok: false, error: browser.i18n.getMessage("controller_no_tabs") };
  }

  function handleCommand(command, tab) {
    if (command !== "history-back" && command !== "history-forward") {
      return Promise.resolve();
    }
    if (!started) {
      start();
    }
    const windowId = isTabId(tab?.windowId) ? tab.windowId : null;
    return enqueue(() => executeSwitch({
      kind: "legacy", direction: command === "history-back" ? "back" : "forward", windowId,
    }));
  }

  function handleMove(direction, tab, { modifiers = 0, commit = true } = {}) {
    if ((direction !== "back" && direction !== "forward")
      || !isTabId(tab?.id) || !isTabId(tab?.windowId)) {
      return Promise.resolve({ ok: false, error: browser.i18n.getMessage("controller_source_missing") });
    }
    if (!started) start();
    return enqueue(async () => {
      const revision = inputRevisions.get(tab.windowId) ?? 0;
      const { skipUnavailableTabs } = await readBehaviorSettings(browser);
      return executeSwitch({
        kind: "move", direction, windowId: tab.windowId,
        input: { sourceTabId: tab.id, skipUnavailableTabs, revision, modifiers, commit },
      });
    });
  }

  function finishShortcut(tab, modifiers, { keepTraversal = false } = {}) {
    if (!started) start();
    return enqueue(async () => {
      const windowId = tab.windowId;
      const previous = session.windows[windowId];
      const shortcut = previous?.traversal?.shortcut;
      if (!shortcut || (modifiers & shortcut.modifiers) === shortcut.modifiers
        || (tab.id !== previous.activeTabId && tab.id !== shortcut.sourceTabId)) return { ok: true };
      const { state } = await synchronizeWindow(windowId);
      if (state?.traversal?.shortcut === shortcut) {
        session.windows[windowId] = commitActivation(state, state.activeTabId, { keepTraversal });
      }
      if (session.windows[windowId] !== previous || saveRequired) await save();
      return { ok: true };
    });
  }

  async function describeCandidates(tabs, mode) {
    const canUsePageInput = createPageInputAccessCheck(browser);
    const availabilityRequest = Promise.all(tabs.map((tab) => canUsePageInput(tab)));
    let groupTitles = {};
    if (mode === "tabs") {
      const groupIds = [...new Set(tabs.map((tab) => tab.groupId).filter(isTabId))];
      groupTitles = Object.fromEntries(await Promise.all(groupIds.map(async (groupId) => {
        try {
          const group = await browser.tabGroups.get(groupId);
          return [groupId, group.title || browser.i18n.getMessage("controller_group")];
        } catch {
          return [groupId, browser.i18n.getMessage("controller_group")];
        }
      })));
    }
    const availability = await availabilityRequest;
    const items = tabs.map((candidate, index) => ({
      tabId: candidate.id,
      title: candidate.title || browser.i18n.getMessage("controller_untitled"),
      favIconUrl: candidate.favIconUrl || "",
      groupId: isTabId(candidate.groupId) ? candidate.groupId : -1,
      inputAvailable: availability[index],
    }));
    return { items, groupTitles };
  }

  function getCandidates(direction, tab, mode = "mru", { fresh = false } = {}) {
    if ((direction !== "back" && direction !== "forward")
      || (mode !== "mru" && mode !== "tabs")
      || !isTabId(tab?.id) || !isTabId(tab?.windowId)) {
      return Promise.resolve({ ok: false, error: browser.i18n.getMessage("controller_display_source_missing") });
    }
    if (!started) {
      start();
    }
    const { id: sourceTabId, windowId } = tab;
    return enqueue(async () => {
      const previousState = session.windows[windowId];
      const current = await synchronizeWindow(windowId);
      if (!current.state || current.activeTab?.id !== sourceTabId) {
        return { ok: false, error: browser.i18n.getMessage("controller_list_cancelled") };
      }

      const state = fresh && current.state.traversal?.committed ? endTraversal(current.state) : current.state;
      const request = mode === "tabs"
        ? { state, targetTabId: sourceTabId }
        : beginOrMove(state, direction);
      session.windows[windowId] = request.state;
      const candidateTabs = mode === "tabs"
        ? [...current.tabs].sort((first, second) => first.index - second.index)
        : (request.state.traversal?.tabIds ?? [])
          .filter((tabId) => tabId !== sourceTabId)
          .map((tabId) => current.tabsById.get(tabId))
          .filter(Boolean);
      const { items, groupTitles } = await describeCandidates(candidateTabs, mode);
      if (mode === "tabs") {
        session.windows[windowId] = {
          ...request.state,
          tabListSnapshot: {
            generation: request.state.generation,
            sourceTabId,
            tabIds: items.map((item) => item.tabId),
          },
        };
      }
      let selectedIndex = items.findIndex((item) => item.tabId === request.targetTabId);
      if (selectedIndex < 0 && items.length > 0) {
        selectedIndex = direction === "back" ? items.length - 1 : 0;
      }
      if (saveRequired || session.windows[windowId] !== previousState) await save();
      return {
        ok: true,
        mode,
        items,
        groupTitles,
        selectedIndex,
        generation: request.state.generation,
        sourceTabId,
        windowId,
      };
    }).then((result) => result ?? { ok: false, error: browser.i18n.getMessage("controller_candidates_failed") });
  }

  function selectCandidate(selection, tab) {
    if (!isTabId(tab?.id) || !isTabId(tab?.windowId)
      || !isTabId(selection?.sourceTabId) || !isTabId(selection?.targetTabId)
      || !Number.isSafeInteger(selection?.generation) || selection.generation < 0
      || (selection.mode !== undefined && selection.mode !== "mru" && selection.mode !== "tabs")
      || selection.sourceTabId !== tab.id) {
      return Promise.resolve({ ok: false, error: browser.i18n.getMessage("controller_selection_source_missing") });
    }
    if (!started) {
      start();
    }
    const request = {
      generation: selection.generation,
      sourceTabId: selection.sourceTabId,
      targetTabId: selection.targetTabId,
      mode: selection.mode ?? "mru",
    };
    const windowId = tab.windowId;
    return enqueue(() => executeSwitch({ kind: "select", windowId, selection: request }))
      .then((result) => result ?? { ok: false, error: browser.i18n.getMessage("controller_candidate_failed") });
  }

  function reconcileEvent(windowId, createdTab = null) {
    return enqueue(async () => {
      const previous = session.windows[windowId];
      if (createdTab?.active === false && previous?.activeTabId != null && !saveRequired
        && !previous.mruTabIds.includes(createdTab.id)) return;
      const { state } = await synchronizeWindow(windowId);
      if (saveRequired || (state !== previous && !(state === null && previous === undefined))) await save();
    });
  }

  async function replaceTab(addedTabId, removedTabId) {
    const tabs = await browser.tabs.query({});
    const added = tabs.find((tab) => tab.id === addedTabId);
    for (const [key, state] of Object.entries(session.windows)) {
      if (!added || state.windowId !== added.windowId) {
        session.windows[key] = removeTab(state, removedTabId);
        continue;
      }
      const replaceIds = (ids) => [...new Set(ids.map((id) => id === removedTabId ? addedTabId : id))];
      const activeTabId = state.activeTabId === removedTabId ? addedTabId : state.activeTabId;
      let traversal = state.traversal;
      if (traversal) {
        const tabIds = replaceIds(traversal.tabIds);
        traversal = { ...traversal, tabIds, cursor: tabIds.indexOf(activeTabId) };
      }
      session.windows[key] = { ...state, activeTabId, mruTabIds: replaceIds(state.mruTabIds), traversal };
      await synchronizeWindow(state.windowId);
    }
    await save();
  }

  function start() {
    if (started) {
      return initialization;
    }
    started = true;
    // Chrome exposes this API only when the manifest declares legacy commands.
    legacy.listen(handleCommand);
    browser.tabs.onActivated.addListener((info) => {
      const operation = inFlight.get(info.windowId);
      const expected = expectedActivations.get(info.windowId) ?? [];
      const ownIndex = expected.findIndex((entry) => entry.targetTabId === info.tabId);
      const ownOperation = ownIndex >= 0 ? expected.splice(ownIndex, 1)[0] : null;
      const matchesConfirmed = () => ownOperation?.confirmed && !saveRequired
        && session.windows[info.windowId]?.activeTabId === info.tabId
        && session.windows[info.windowId]?.generation === ownOperation.generation;
      // Skip only a notification that still describes the state we saved.
      if (matchesConfirmed()) return;
      const ownActivation = ownOperation !== null && !ownOperation.confirmed;
      let observedTabId = ownActivation ? null : info.tabId;
      let shouldReconcile = true;
      const observeExternal = () => {
        inputRevisions.set(info.windowId, (inputRevisions.get(info.windowId) ?? 0) + 1);
      };
      let verification = Promise.resolve();
      if (ownOperation?.confirmed) {
        // A previous expected target can also be a new, external selection.
        // Ignore a delayed old notification only when its tab is no longer active.
        verification = browser.tabs.query({ windowId: info.windowId, active: true }).then((tabs) => {
          shouldReconcile = tabs.some((tab) => tab.id === info.tabId);
          if (!shouldReconcile) return;
          const externalSelection = session.windows[info.windowId]?.activeTabId !== info.tabId;
          if (externalSelection) observeExternal();
          if (externalSelection && operation && operation.targetTabId !== info.tabId
            && inFlight.get(info.windowId) === operation) {
            operation.interrupted = true;
          }
        }).catch(() => {
          if (session.windows[info.windowId]?.activeTabId !== info.tabId) observeExternal();
          observedTabId = null;
          if (operation) operation.interrupted = true;
        });
      } else {
        if (!ownActivation && session.windows[info.windowId]?.activeTabId !== info.tabId) observeExternal();
        if (operation && !ownActivation && operation.targetTabId !== info.tabId
          && session.windows[info.windowId]?.activeTabId !== info.tabId) {
          verification = browser.tabs.query({ windowId: info.windowId, active: true }).then((tabs) => {
            if (tabs.some((tab) => tab.id === info.tabId) && inFlight.get(info.windowId) === operation) {
              operation.interrupted = true;
            }
          }).catch(() => {
            operation.interrupted = true;
          });
        }
      }
      void enqueue(async () => {
        await verification;
        if (!shouldReconcile || matchesConfirmed()) return;
        const previous = session.windows[info.windowId];
        await synchronizeWindow(info.windowId, null, observedTabId);
        if (saveRequired || session.windows[info.windowId] !== previous) await save();
      });
    });
    browser.tabs.onCreated.addListener((tab) => { void reconcileEvent(tab.windowId, tab); });
    browser.tabs.onRemoved.addListener((_tabId, info) => {
      if (info.isWindowClosing) {
        const operation = inFlight.get(info.windowId);
        if (operation) operation.interrupted = true;
        return;
      }
      void reconcileEvent(info.windowId);
    });
    browser.tabs.onDetached.addListener((_tabId, info) => { void reconcileEvent(info.oldWindowId); });
    browser.tabs.onAttached.addListener((_tabId, info) => { void reconcileEvent(info.newWindowId); });
    browser.tabs.onReplaced.addListener((added, removed) => { void enqueue(() => replaceTab(added, removed)); });
    browser.windows.onRemoved.addListener((windowId) => {
      const operation = inFlight.get(windowId);
      if (operation) {
        operation.interrupted = true;
      }
      void enqueue(async () => {
        delete session.windows[windowId];
        expectedActivations.delete(windowId);
        inputRevisions.delete(windowId);
        await save();
      });
    });
    browser.action.onClicked.addListener(() => {
      void browser.runtime.openOptionsPage().catch(() => reportFailure("settings could not be opened"));
    });
    browser.storage.onChanged?.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      if (Object.hasOwn(changes, "mruSettings") || Object.hasOwn(changes, "mruShortcuts")) {
        for (const windowId of Object.keys(session.windows)) {
          const id = Number(windowId);
          inputRevisions.set(id, (inputRevisions.get(id) ?? 0) + 1);
        }
      }
      if (!Object.hasOwn(changes, "mruSettings")) return;
      void enqueue(async () => {
        const updated = (await readBehaviorSettings(browser)).maxPastTabs;
        if (updated === maxPastTabs) return;
        maxPastTabs = updated;
        for (const [windowId, state] of Object.entries(session.windows)) {
          session.windows[windowId] = setHistoryLimit(state, maxPastTabs);
        }
        nextRevision();
        await save();
      });
    });
    initialization = initialize().catch(() => reportFailure("history could not be initialized"));
    return initialization;
  }

  async function idle() {
    await initialization;
    let pending;
    do {
      pending = queue;
      await pending;
    } while (pending !== queue);
  }

  return { start, handleCommand, handleMove, finishShortcut, getCandidates, selectCandidate, idle };
}
