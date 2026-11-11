import {
  beginOrMove,
  confirmMove,
  createWindowState,
  observeActivation,
  removeTab,
  setHistoryLimit,
} from "./history.js";
import { formatShortcut } from "./shortcuts.js";
import { DEFAULT_MAX_PAST_TABS, readSettings } from "./settings.js";
import { canUsePageInput } from "./tab-access.js";

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

function reconcileTabs(state, tabs, internalTarget = null) {
  const liveIds = new Set(tabs.map((tab) => tab.id));
  const trackedIds = new Set([...state.mruTabIds, ...(state.traversal?.tabIds ?? [])]);
  let nextState = state;

  for (const tabId of trackedIds) {
    if (!liveIds.has(tabId)) {
      nextState = removeTab(nextState, tabId);
    }
  }

  const activeTab = tabs.find((tab) => tab.active);
  if (activeTab) {
    return observeActivation(nextState, activeTab.id, {
      internal: activeTab.id === internalTarget,
    });
  }

  if (nextState.activeTabId !== null) {
    return { ...endTraversal(nextState), activeTabId: null };
  }
  return nextState;
}

function restoreWindow(windowId, saved, tabs, maxPastTabs) {
  const activeTabId = tabs.find((tab) => tab.active)?.id ?? null;
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

  const snapshot = saved.tabListSnapshot;
  if (snapshot?.sourceTabId === state.activeTabId && snapshot.generation === state.generation
    && Array.isArray(snapshot.tabIds) && snapshot.tabIds.every(isTabId)
    && new Set(snapshot.tabIds).size === snapshot.tabIds.length) {
    state.tabListSnapshot = { ...snapshot, tabIds: [...snapshot.tabIds] };
  }

  if (saved.pendingSwitch) {
    state = endTraversal(state);
  }
  return reconcileTabs(setHistoryLimit(state, maxPastTabs), tabs);
}

export function createController(browser) {
  const translate = (name, substitutions) => browser.i18n.getMessage(name, substitutions);
  let session = { schemaVersion: 1, revision: 0, windows: {} };
  let started = false;
  let initialization = Promise.resolve();
  let queue = Promise.resolve();
  let maxPastTabs = DEFAULT_MAX_PAST_TABS;
  const inFlight = new Map();
  const expectedActivations = new Map();
  // Detect input-context changes before their queued history updates run.
  const inputRevisions = new Map();

  function reportFailure(kind) {
    console.warn(`tabuchan: ${kind}`);
  }

  function nextRevision() {
    session.revision = Math.max(Date.now(), session.revision + 1);
    return session.revision;
  }

  async function save() {
    await browser.storage.session.set({ mruState: structuredClone(session) });
  }

  function enqueue(task) {
    queue = queue.then(() => initialization).then(task).catch(() => {
      reportFailure("operation failed");
    });
    return queue;
  }

  async function synchronizeWindow(windowId, internalTarget = null, observedTabId = null) {
    const tabs = (await browser.tabs.query({ windowId })).filter((tab) => isTabId(tab.id));
    if (tabs.length === 0) {
      delete session.windows[windowId];
      return { tabs, state: null, activeTab: null };
    }

    let state = session.windows[windowId] ?? createWindowState(windowId, null, maxPastTabs);
    if (observedTabId !== null && tabs.some((tab) => tab.id === observedTabId)) {
      state = observeActivation(state, observedTabId);
    }
    const updated = reconcileTabs(state, tabs, internalTarget);
    session.windows[windowId] = updated;
    return { tabs, state: updated, activeTab: tabs.find((tab) => tab.active) ?? null };
  }

  async function showStatus(tab, unavailable = false, message = translate("controller_display_unavailable")) {
    const title = tab.title || translate("controller_untitled");
    await Promise.allSettled([
      browser.action.setBadgeText({ tabId: tab.id, text: unavailable ? "!" : "" }),
      browser.action.setTitle({
        tabId: tab.id,
        title: unavailable ? `tabuchan\n${title}\n${message}` : `tabuchan\n${title}`,
      }),
    ]);
  }

  async function showOverlay(tab, state, boundary) {
    if (!tab) {
      return;
    }
    if (!/^https?:\/\//i.test(tab.url ?? "")) {
      await showStatus(tab, true);
      return;
    }

    let shortcuts = [];
    try {
      if (browser.commands) {
        shortcuts = await browser.commands.getAll();
      } else {
        const { shortcuts: bindings } = await readSettings(browser);
        shortcuts = [
          { name: "history-back", shortcut: formatShortcut(bindings.back[0]) },
          { name: "history-forward", shortcut: formatShortcut(bindings.forward[0]) },
        ];
      }
    } catch {
      reportFailure("shortcut information unavailable");
    }

    const message = {
      type: "mru-show",
      revision: session.revision,
      title: tab.title || translate("controller_untitled"),
      favIconUrl: tab.favIconUrl || "",
      position: state.traversal?.cursor ?? 0,
      pastCount: Math.max(0, (state.traversal?.tabIds.length ?? state.mruTabIds.length) - 1),
      backShortcut: shortcuts.find((command) => command.name === "history-back")?.shortcut || "",
      forwardShortcut: shortcuts.find((command) => command.name === "history-forward")?.shortcut || "",
      boundary,
    };

    try {
      let response;
      try {
        response = await browser.tabs.sendMessage(tab.id, message);
      } catch {
        response = null;
      }
      if (!response?.ok) {
        await browser.scripting.executeScript({ target: { tabId: tab.id }, files: ["src/overlay.js"] });
        response = await browser.tabs.sendMessage(tab.id, message);
      }
      await showStatus(tab, !response?.ok);
    } catch {
      await showStatus(tab, true);
    }
  }

  async function initialize() {
    maxPastTabs = (await readSettings(browser)).maxPastTabs;
    const tabs = (await browser.tabs.query({})).filter((tab) => isTabId(tab.id));
    let stored;
    try {
      stored = (await browser.storage.session.get("mruState")).mruState;
    } catch {
      reportFailure("saved history unavailable");
    }

    const savedWindows = stored?.schemaVersion === 1 && stored.windows
      && typeof stored.windows === "object" && !Array.isArray(stored.windows) ? stored.windows : {};
    const windows = {};
    for (const windowId of new Set(tabs.map((tab) => tab.windowId))) {
      windows[windowId] = restoreWindow(
        windowId,
        savedWindows[windowId],
        tabs.filter((tab) => tab.windowId === windowId),
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

  async function findAvailableMove(request, tabs, direction) {
    if (request.targetTabId === null) return request;
    const { tabIds, cursor } = request.state.traversal;
    const step = direction === "back" ? 1 : -1;
    for (let index = cursor + step; index >= 0 && index < tabIds.length; index += step) {
      const candidate = tabs.find((tab) => tab.id === tabIds[index]);
      if (candidate && await canUsePageInput(browser, candidate)) {
        return { ...request, targetTabId: candidate.id };
      }
    }
    return { ...request, targetTabId: null };
  }

  async function runCommand(command, suppliedWindowId, selection = null, input = null) {
    const windowId = suppliedWindowId ?? (await browser.windows.getLastFocused({ populate: false })).id;
    if (!isTabId(windowId)) {
      return { ok: false, error: translate("controller_window_read_failed") };
    }

    const quiet = selection !== null || input !== null;
    const direction = command === "history-back" ? "back" : "forward";
    for (let attempt = 0; attempt <= maxPastTabs; attempt += 1) {
      const current = await synchronizeWindow(windowId);
      if (!current.state) {
        return { ok: false, error: translate("controller_window_missing") };
      }
      if (input && (current.activeTab?.id !== input.sourceTabId
        || (inputRevisions.get(windowId) ?? 0) !== input.revision)) {
        return { ok: false, error: translate("controller_move_cancelled") };
      }
      const tabListSelection = selection?.mode === "tabs";
      const snapshot = tabListSelection ? current.state.tabListSnapshot : current.state.traversal;
      if (selection && (current.activeTab?.id !== selection.sourceTabId
        || current.state.generation !== selection.generation
        || !snapshot?.tabIds.includes(selection.targetTabId)
        || (tabListSelection && (snapshot.sourceTabId !== selection.sourceTabId
          || snapshot.generation !== selection.generation))
        || (!tabListSelection && selection.targetTabId === selection.sourceTabId)
        || !current.tabs.some((tab) => tab.id === selection.targetTabId))) {
        return { ok: false, error: translate("controller_candidates_updated") };
      }
      if (tabListSelection && selection.targetTabId === selection.sourceTabId) return { ok: true };
      const requestState = tabListSelection ? endTraversal(current.state) : current.state;
      let request = selection
        ? { state: requestState, targetTabId: selection.targetTabId }
        : beginOrMove(current.state, direction);
      if (input?.skipUnavailableTabs) {
        request = await findAvailableMove(request, current.tabs, direction);
      }
      if (input) {
        const refreshed = await synchronizeWindow(windowId);
        if (!refreshed.state || refreshed.activeTab?.id !== input.sourceTabId
          || refreshed.state.generation !== current.state.generation
          || (inputRevisions.get(windowId) ?? 0) !== input.revision) {
          await save();
          return { ok: false, error: translate("controller_move_cancelled") };
        }
        if (request.targetTabId !== null && !refreshed.tabs.some((tab) => tab.id === request.targetTabId)) {
          continue;
        }
      }
      session.windows[windowId] = request.state;
      nextRevision();

      if (request.targetTabId === null) {
        await save();
        if (!quiet) await showOverlay(current.activeTab, request.state, true);
        return { ok: true };
      }

      const operation = {
        targetTabId: request.targetTabId,
        generation: request.state.generation,
        interrupted: false,
      };
      inFlight.set(windowId, operation);
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
        try {
          await save();
        } catch {
          session.windows[windowId] = { ...request.state, pendingSwitch: null };
          reportFailure("history could not be saved before switching");
          if (current.activeTab) {
            await showStatus(current.activeTab, true, translate("controller_history_save_status"));
          }
          return { ok: false, error: translate("controller_history_save_failed") };
        }

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
          return { ok: false, error: translate("controller_selection_cancelled") };
        }

        let updateFailed = false;
        const expected = expectedActivations.get(windowId) ?? [];
        expected.push(operation);
        expectedActivations.set(windowId, expected);
        try {
          await browser.tabs.update(request.targetTabId, { active: true });
        } catch {
          updateFailed = true;
          const index = expected.indexOf(operation);
          if (index >= 0) expected.splice(index, 1);
        }

        if (operation.interrupted) {
          session.windows[windowId] = endTraversal(session.windows[windowId]);
        }
        const internalTarget = operation.interrupted || updateFailed ? null : request.targetTabId;
        const result = await synchronizeWindow(windowId, internalTarget);
        if (!result.state) {
          await save();
          return { ok: false, error: translate("controller_window_missing") };
        }

        const succeeded = !updateFailed && !operation.interrupted
          && result.activeTab?.id === request.targetTabId
          && result.state.generation === operation.generation;
        let updated = result.state;
        if (succeeded) {
          updated = confirmMove(updated, request.targetTabId);
        }
        session.windows[windowId] = { ...updated, pendingSwitch: null };

        let saved = true;
        try {
          await save();
        } catch {
          saved = false;
          reportFailure("history could not be saved after switching");
        }

        const targetDisappeared = !result.tabs.some((tab) => tab.id === request.targetTabId);
        if (!selection && updateFailed && targetDisappeared && !operation.interrupted && saved) {
          continue;
        }
        if (!quiet && result.activeTab && (succeeded || !updateFailed)) {
          await showOverlay(result.activeTab, session.windows[windowId], false);
        }
        if (!saved && result.activeTab) {
          await showStatus(result.activeTab, true, translate("controller_history_save_status"));
        }
        if (updateFailed && !targetDisappeared) {
          reportFailure("tab could not be switched");
          if (result.activeTab) {
            await showStatus(result.activeTab, true, translate("controller_tab_switch_failed"));
          }
        }
        if (succeeded) {
          return { ok: true };
        }
        return { ok: false, error: translate("controller_candidate_retry") };
      } finally {
        inFlight.delete(windowId);
      }
    }
    return { ok: false, error: translate("controller_no_tabs") };
  }

  function handleCommand(command, tab) {
    if (command !== "history-back" && command !== "history-forward") {
      return Promise.resolve();
    }
    if (!started) {
      start();
    }
    const windowId = isTabId(tab?.windowId) ? tab.windowId : null;
    return enqueue(() => runCommand(command, windowId));
  }

  function handleMove(direction, tab) {
    if ((direction !== "back" && direction !== "forward")
      || !isTabId(tab?.id) || !isTabId(tab?.windowId)) {
      return Promise.resolve({ ok: false, error: translate("controller_source_missing") });
    }
    if (!started) start();
    return enqueue(async () => {
      const revision = inputRevisions.get(tab.windowId) ?? 0;
      const { skipUnavailableTabs } = await readSettings(browser);
      return runCommand(`history-${direction}`, tab.windowId, null, {
        sourceTabId: tab.id,
        skipUnavailableTabs,
        revision,
      });
    });
  }

  async function candidateItems(tabs) {
    const groupIds = [...new Set(tabs.map((tab) => tab.groupId).filter(isTabId))];
    const groups = new Map(await Promise.all(groupIds.map(async (groupId) => {
      try {
        const group = await browser.tabGroups.get(groupId);
        return [groupId, { title: group.title || translate("controller_group"), color: group.color }];
      } catch {
        return [groupId, { title: translate("controller_group"), color: "grey" }];
      }
    })));
    return Promise.all(tabs.map(async (candidate) => ({
      tabId: candidate.id,
      title: candidate.title || translate("controller_untitled"),
      favIconUrl: candidate.favIconUrl || "",
      groupId: isTabId(candidate.groupId) ? candidate.groupId : -1,
      group: groups.get(candidate.groupId),
      inputAvailable: await canUsePageInput(browser, candidate),
    })));
  }

  function getCandidates(direction, tab, mode = "mru") {
    if ((direction !== "back" && direction !== "forward")
      || (mode !== "mru" && mode !== "tabs")
      || !isTabId(tab?.id) || !isTabId(tab?.windowId)) {
      return Promise.resolve({ ok: false, error: translate("controller_display_source_missing") });
    }
    if (!started) {
      start();
    }
    const { id: sourceTabId, windowId } = tab;
    return enqueue(async () => {
      const current = await synchronizeWindow(windowId);
      if (!current.state || current.activeTab?.id !== sourceTabId) {
        return { ok: false, error: translate("controller_list_cancelled") };
      }

      const request = mode === "tabs"
        ? { state: current.state, targetTabId: sourceTabId }
        : beginOrMove(current.state, direction);
      session.windows[windowId] = request.state;
      const candidateTabs = mode === "tabs"
        ? [...current.tabs].sort((first, second) => first.index - second.index)
        : (request.state.traversal?.tabIds ?? [])
          .filter((tabId) => tabId !== sourceTabId)
          .map((tabId) => current.tabs.find((candidate) => candidate.id === tabId))
          .filter(Boolean);
      const items = await candidateItems(candidateTabs);
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
      await save();
      return {
        ok: true,
        mode,
        items,
        selectedIndex,
        generation: request.state.generation,
        sourceTabId,
        windowId,
      };
    }).then((result) => result ?? { ok: false, error: translate("controller_candidates_failed") });
  }

  function selectCandidate(selection, tab) {
    if (!isTabId(tab?.id) || !isTabId(tab?.windowId)
      || !isTabId(selection?.sourceTabId) || !isTabId(selection?.targetTabId)
      || !Number.isSafeInteger(selection?.generation) || selection.generation < 0
      || (selection.mode !== undefined && selection.mode !== "mru" && selection.mode !== "tabs")
      || selection.sourceTabId !== tab.id) {
      return Promise.resolve({ ok: false, error: translate("controller_selection_source_missing") });
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
    return enqueue(() => runCommand("history-back", windowId, request))
      .then((result) => result ?? { ok: false, error: translate("controller_candidate_failed") });
  }

  function reconcileEvent(windowId) {
    return enqueue(async () => {
      await synchronizeWindow(windowId);
      await save();
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
    browser.commands?.onCommand.addListener((command, tab) => { void handleCommand(command, tab); });
    browser.tabs.onActivated.addListener((info) => {
      const operation = inFlight.get(info.windowId);
      const expected = expectedActivations.get(info.windowId) ?? [];
      const ownIndex = expected.findIndex((entry) => entry.targetTabId === info.tabId);
      const ownActivation = ownIndex >= 0;
      if (ownActivation) expected.splice(ownIndex, 1);
      if (!ownActivation && session.windows[info.windowId]?.activeTabId !== info.tabId) {
        inputRevisions.set(info.windowId, (inputRevisions.get(info.windowId) ?? 0) + 1);
      }
      let verification = Promise.resolve();
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
      void enqueue(async () => {
        await verification;
        await synchronizeWindow(info.windowId, null, ownActivation ? null : info.tabId);
        await save();
      });
    });
    browser.tabs.onCreated.addListener((tab) => { void reconcileEvent(tab.windowId); });
    browser.tabs.onRemoved.addListener((_tabId, info) => { void reconcileEvent(info.windowId); });
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
        const updated = (await readSettings(browser)).maxPastTabs;
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

  return { start, handleCommand, handleMove, getCandidates, selectCandidate, idle };
}
