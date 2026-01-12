// =============================================================================
// SubSense Popup State Machine — Core
// =============================================================================

import type {
  StateId,
  PopupContext,
  PopupEvent,
  MachineState,
  TabId,
} from './types';
import { initialContext, STATE_CONFIG } from './types';
import { evaluateGuard } from './guards';
import { executeActions } from './actions';
import { executeSideEffects, type SideEffectDeps } from './effects';

// -----------------------------------------------------------------------------
// Transition Definitions
// -----------------------------------------------------------------------------

interface TransitionDef {
  target?: StateId | '__DYNAMIC_PARENT__';
  guard?: string;
  actions?: Array<string | { type: string; value?: string }>;
  sideEffects?: Array<string | { type: string; message?: string }>;
}

type TransitionConfig = TransitionDef | TransitionDef[];

// State transition map (derived from state-map.json)
const transitions: Record<StateId, Record<string, TransitionConfig>> = {
  Home: {
    SCORE_PAGE: { target: 'Loading', sideEffects: ['startScoring'] },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
    VIEW_HISTORY: { target: 'MyScores', guard: 'hasScoreReports' },
  },

  Loading: {
    SCORE_SUCCESS: { target: 'Result', actions: ['setScoreReport'] },
    SCORE_LOW_CONFIDENCE: {
      target: 'Result',
      actions: ['setScoreReport', 'setLowConfidenceFlag'],
    },
    SCORE_ERROR_CSP: {
      target: 'ErrorCSP',
      guard: 'notPageReadable',
      actions: ['setError'],
    },
    SCORE_ERROR_PERMISSION: {
      target: 'ErrorPermission',
      guard: 'notPermissionGranted',
      actions: ['setError'],
    },
  },

  Result: {
    BACK: { target: 'Home', guard: 'notSaving', actions: ['clearScoreReport'] },
    ANSWER_QUESTIONS: { target: 'EvidencePrompt', guard: 'hasLowConfidence' },
    SAVE: { actions: ['setSaving'], sideEffects: ['saveScore'] },
    SAVE_SUCCESS: {
      target: 'MyScores',
      actions: ['clearSaving', 'incrementScoreReportCount'],
      sideEffects: [{ type: 'showToast', message: 'Saved to My Scores' }],
    },
    SAVE_FAILURE: {
      actions: ['clearSaving'],
      sideEffects: [{ type: 'showToast', message: "Couldn't save. Storage full." }],
    },
    SHARE: { actions: ['setSharing'], sideEffects: ['generateShareImage'] },
    SHARE_SUCCESS: {
      actions: ['clearSharing'],
      sideEffects: [{ type: 'showToast', message: 'Score card generated' }],
    },
    SHARE_FAILURE: {
      actions: ['clearSharing'],
      sideEffects: [
        'copyTextSummary',
        { type: 'showToast', message: 'Copied summary to clipboard' },
      ],
    },
    ADD_SUBSCRIPTION: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'subscriptionForm' },
        { type: 'setModalParentState', value: 'Result' },
        'prefillSubscriptionDomain',
      ],
    },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
  },

  EvidencePrompt: {
    BACK: {
      target: 'Result',
      guard: 'notSubmitting',
      actions: ['clearEvidenceResponses'],
    },
    SET_ANSWER: { actions: ['updateEvidenceResponse'] },
    SUBMIT: {
      guard: 'allQuestionsAnswered',
      actions: ['setSubmitting'],
      sideEffects: ['recalcScore'],
    },
    RECALC_SUCCESS: {
      target: 'Result',
      actions: ['clearSubmitting', 'updateScoreReport', 'clearEvidenceResponses'],
      sideEffects: [{ type: 'showToast', message: 'Updated score with your answers' }],
    },
    RECALC_FAILURE: {
      actions: ['clearSubmitting', 'setError'],
      sideEffects: [{ type: 'showToast', message: "Couldn't update score. Try again." }],
    },
  },

  ErrorCSP: {
    BACK: { target: 'Home' },
    ANSWER_MANUAL: { target: 'EvidencePrompt', actions: ['setManualScoreFlag'] },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
  },

  ErrorPermission: {
    BACK: { target: 'Home' },
    GRANT_PERMISSION: { sideEffects: ['requestPermission'] },
    PERMISSION_GRANTED: {
      target: 'Loading',
      guard: 'permissionGranted',
      sideEffects: ['startScoring'],
    },
    PERMISSION_DENIED: {
      sideEffects: [
        { type: 'showToast', message: 'Permission required to analyze this page' },
      ],
    },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
  },

  MyScores: {
    SELECT_REPORT: { target: 'ScoreDetail', actions: ['setSelectedReportId'] },
    SCORE_PAGE: { target: 'Loading', sideEffects: ['startScoring'] },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
  },

  ScoreDetail: {
    BACK: { target: 'MyScores', actions: ['clearSelectedReportId'] },
    SHARE: { actions: ['setSharing'], sideEffects: ['generateShareImage'] },
    SHARE_SUCCESS: {
      actions: ['clearSharing'],
      sideEffects: [{ type: 'showToast', message: 'Score card generated' }],
    },
    SHARE_FAILURE: {
      actions: ['clearSharing'],
      sideEffects: [
        'copyTextSummary',
        { type: 'showToast', message: 'Copied summary to clipboard' },
      ],
    },
    DELETE: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'confirmDelete' },
        { type: 'setModalParentState', value: 'ScoreDetail' },
      ],
    },
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
    TAB_PRIVACY: { target: 'Privacy' },
  },

  Subscriptions: {
    ADD_SUBSCRIPTION: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'subscriptionForm' },
        { type: 'setModalParentState', value: 'Subscriptions' },
      ],
    },
    EDIT_SUBSCRIPTION: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'subscriptionForm' },
        { type: 'setModalParentState', value: 'Subscriptions' },
        'setSelectedSubscriptionId',
      ],
    },
    DELETE_SUBSCRIPTION: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'confirmDelete' },
        { type: 'setModalParentState', value: 'Subscriptions' },
        'setSelectedSubscriptionId',
      ],
    },
    TAB_SCORES: [
      { target: 'MyScores', guard: 'hasScoreReports' },
      { target: 'Home', guard: 'noScoreReports' },
    ],
    TAB_PRIVACY: { target: 'Privacy' },
  },

  Privacy: {
    CLEAR_ALL_DATA: {
      target: 'ModalOpen',
      actions: [
        { type: 'setModalType', value: 'confirmClearAll' },
        { type: 'setModalParentState', value: 'Privacy' },
      ],
    },
    TAB_SCORES: [
      { target: 'MyScores', guard: 'hasScoreReports' },
      { target: 'Home', guard: 'noScoreReports' },
    ],
    TAB_SUBSCRIPTIONS: { target: 'Subscriptions' },
  },

  ModalOpen: {
    MODAL_CLOSE: { target: '__DYNAMIC_PARENT__', actions: ['clearModalState'] },
    CANCEL: { target: '__DYNAMIC_PARENT__', actions: ['clearModalState'] },
    SAVE_SUBSCRIPTION: { actions: ['setSaving'], sideEffects: ['saveSubscription'] },
    SAVE_SUBSCRIPTION_SUCCESS: {
      target: 'Subscriptions',
      actions: ['clearSaving', 'clearModalState', 'incrementSubscriptionCount'],
      sideEffects: [{ type: 'showToast', message: 'Subscription saved' }],
    },
    SAVE_SUBSCRIPTION_FAILURE: {
      actions: ['clearSaving'],
      sideEffects: [{ type: 'showToast', message: "Couldn't save subscription" }],
    },
    DELETE_CONFIRMED: [
      { guard: 'isScoreDelete', sideEffects: ['deleteScore'] },
      { guard: 'isSubscriptionDelete', sideEffects: ['deleteSubscription'] },
      { guard: 'isClearAllData', sideEffects: ['clearAllData'] },
    ],
    DELETE_SCORE_SUCCESS: {
      target: 'MyScores',
      actions: ['clearModalState', 'clearSelectedReportId', 'decrementScoreReportCount'],
      sideEffects: [{ type: 'showToast', message: 'Deleted score' }],
    },
    DELETE_SUBSCRIPTION_SUCCESS: {
      target: 'Subscriptions',
      actions: [
        'clearModalState',
        'clearSelectedSubscriptionId',
        'decrementSubscriptionCount',
      ],
      sideEffects: [{ type: 'showToast', message: 'Subscription deleted' }],
    },
    CLEAR_ALL_SUCCESS: {
      target: 'Home',
      actions: ['clearModalState', 'resetCounts', 'resetContext'],
      sideEffects: [{ type: 'showToast', message: 'All data cleared' }],
    },
  },
};

// -----------------------------------------------------------------------------
// Machine Implementation
// -----------------------------------------------------------------------------

export function createMachine(
  initialState: StateId = 'Home',
  initialCtx?: Partial<PopupContext>
) {
  let state: MachineState = {
    current: initialState,
    context: { ...initialContext, ...initialCtx },
    history: [],
  };

  const listeners = new Set<(state: MachineState) => void>();

  function notify() {
    listeners.forEach((listener) => listener(state));
  }

  function resolveDynamicTarget(target: StateId | '__DYNAMIC_PARENT__'): StateId {
    if (target === '__DYNAMIC_PARENT__') {
      return state.context.modalParentState ?? 'Home';
    }
    return target;
  }

  function findMatchingTransition(
    transitionConfig: TransitionConfig,
    context: PopupContext
  ): TransitionDef | null {
    if (Array.isArray(transitionConfig)) {
      // Find first matching guard
      for (const t of transitionConfig) {
        if (evaluateGuard(t.guard, context)) {
          return t;
        }
      }
      return null;
    }

    // Single transition - check guard
    if (evaluateGuard(transitionConfig.guard, context)) {
      return transitionConfig;
    }
    return null;
  }

  async function send(event: PopupEvent): Promise<void> {
    const currentTransitions = transitions[state.current];
    if (!currentTransitions) {
      console.warn(`No transitions defined for state: ${state.current}`);
      return;
    }

    const transitionConfig = currentTransitions[event.type];
    if (!transitionConfig) {
      console.warn(`No transition for event ${event.type} in state ${state.current}`);
      return;
    }

    const transition = findMatchingTransition(transitionConfig, state.context);
    if (!transition) {
      console.warn(`Guard blocked transition for ${event.type} in ${state.current}`);
      return;
    }

    // Execute actions
    if (transition.actions) {
      state.context = executeActions(transition.actions, state.context, event);
    }

    // Update state if target specified
    if (transition.target) {
      const newState = resolveDynamicTarget(transition.target);
      state.history.push(state.current);
      state.current = newState;

      // Update activeTab based on new state
      const config = STATE_CONFIG[newState];
      if (config.tab !== 'inherit') {
        state.context.activeTab = config.tab;
      }
    }

    notify();

    // Execute side effects (async, after state update)
    if (transition.sideEffects) {
      const deps: SideEffectDeps = {
        dispatch: send,
        context: state.context,
      };
      await executeSideEffects(transition.sideEffects, deps, event);
    }
  }

  function getState(): MachineState {
    return { ...state, context: { ...state.context } };
  }

  function subscribe(listener: (state: MachineState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function canGoBack(): boolean {
    const config = STATE_CONFIG[state.current];
    return (
      !config.backDisabled &&
      state.current !== 'Home' &&
      state.current !== 'MyScores' &&
      state.current !== 'Subscriptions'
    );
  }

  function getActiveTab(): TabId {
    return state.context.activeTab;
  }

  return {
    send,
    getState,
    subscribe,
    canGoBack,
    getActiveTab,
  };
}

export type PopupMachine = ReturnType<typeof createMachine>;
