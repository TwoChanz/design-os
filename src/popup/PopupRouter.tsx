// =============================================================================
// SubSense Popup Router
// Implements Shell Ownership Rules
// =============================================================================

import React from 'react';
import { useMachine } from '../hooks/useMachine';
import type { StateId, ModalType, TabId } from '../state-machine/types';
import { AppShell } from '../shell/components/AppShell';
import { toastService } from '../services/toast';

// Screen components
import { HomeScreen } from './screens/HomeScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { EvidencePromptScreen } from './screens/EvidencePromptScreen';
import { ErrorCSPScreen } from './screens/ErrorCSPScreen';
import { ErrorPermissionScreen } from './screens/ErrorPermissionScreen';
import { MyScoresScreen } from './screens/MyScoresScreen';
import { ScoreDetailScreen } from './screens/ScoreDetailScreen';
import { SubscriptionsScreen } from './screens/SubscriptionsScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Shared components
import { ToastContainer } from './components/ToastContainer';
import { ModalOverlay } from './components/ModalOverlay';

// Modal content components
import { SubscriptionFormModal } from './modals/SubscriptionFormModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { ConfirmClearAllModal } from './modals/ConfirmClearAllModal';

// =============================================================================
// Shell Ownership Rules
// =============================================================================
// Router decides: activeTab, title, badges, onTabChange
// Screens must NOT set header titles or tabs

// -----------------------------------------------------------------------------
// Tab ↔ State Mapping
// -----------------------------------------------------------------------------

const STATE_TO_TAB: Record<StateId, TabId> = {
  Home: 'scores',
  Loading: 'scores',
  Result: 'scores',
  EvidencePrompt: 'scores',
  ErrorCSP: 'scores',
  ErrorPermission: 'scores',
  MyScores: 'scores',
  ScoreDetail: 'scores',
  Subscriptions: 'subscriptions',
  Privacy: 'privacy',
  ModalOpen: 'scores', // Inherits from parent, computed below
};

// -----------------------------------------------------------------------------
// Header Title Mapping (deterministic)
// -----------------------------------------------------------------------------

const STATE_TO_TITLE: Record<StateId, string> = {
  Home: 'Score',
  Loading: 'Scoring...',
  Result: 'Score Result',
  EvidencePrompt: 'Answer 3 Questions',
  ErrorCSP: 'Blocked Page',
  ErrorPermission: 'Permission Needed',
  MyScores: 'My Scores',
  ScoreDetail: 'Score Details',
  Subscriptions: 'Subscriptions',
  Privacy: 'Privacy',
  ModalOpen: '', // Title comes from modal type
};

const MODAL_TO_TITLE: Record<ModalType, (isEdit: boolean) => string> = {
  subscriptionForm: (isEdit) => (isEdit ? 'Edit Subscription' : 'Add Subscription'),
  confirmDelete: () => 'Confirm Delete',
  confirmClearAll: () => 'Clear All',
};

// -----------------------------------------------------------------------------
// Screen Router
// -----------------------------------------------------------------------------

const screens: Record<StateId, React.ComponentType<any>> = {
  Home: HomeScreen,
  Loading: LoadingScreen,
  Result: ResultScreen,
  EvidencePrompt: EvidencePromptScreen,
  ErrorCSP: ErrorCSPScreen,
  ErrorPermission: ErrorPermissionScreen,
  MyScores: MyScoresScreen,
  ScoreDetail: ScoreDetailScreen,
  Subscriptions: SubscriptionsScreen,
  Privacy: PrivacyScreen,
  ModalOpen: () => null, // Modal content rendered separately
};

const modals: Record<ModalType, React.ComponentType<any>> = {
  subscriptionForm: SubscriptionFormModal,
  confirmDelete: ConfirmDeleteModal,
  confirmClearAll: ConfirmClearAllModal,
};

// -----------------------------------------------------------------------------
// Tab Root States (for navigation)
// -----------------------------------------------------------------------------

export const TAB_ROOT_STATES: Record<TabId, StateId> = {
  scores: 'Home',
  subscriptions: 'Subscriptions',
  privacy: 'Privacy',
};

// -----------------------------------------------------------------------------
// Compute Functions
// -----------------------------------------------------------------------------

function computeActiveTab(state: StateId, modalParentState: StateId | null): TabId {
  if (state === 'ModalOpen' && modalParentState) {
    return STATE_TO_TAB[modalParentState];
  }
  return STATE_TO_TAB[state];
}

function computeTitle(
  state: StateId,
  modalType: ModalType | null,
  modalParentState: StateId | null,
  selectedSubscriptionId: string | null
): string {
  // Modal title wins when modal is open
  if (state === 'ModalOpen' && modalType) {
    const isEdit = modalType === 'subscriptionForm' && selectedSubscriptionId !== null;
    return MODAL_TO_TITLE[modalType](isEdit);
  }

  // When modal open but no type, use parent state title
  if (state === 'ModalOpen' && modalParentState) {
    return STATE_TO_TITLE[modalParentState];
  }

  return STATE_TO_TITLE[state];
}

function isTabSwitchingDisabled(
  state: StateId,
  isSaving: boolean,
  hasUnsavedAnswers: boolean
): boolean {
  // Disable when Loading/Scoring
  if (state === 'Loading') return true;

  // Disable when saving
  if (isSaving) return true;

  // Disable when Evidence Prompt has unsaved answers
  if (state === 'EvidencePrompt' && hasUnsavedAnswers) return true;

  return false;
}

// -----------------------------------------------------------------------------
// Popup Router Component
// -----------------------------------------------------------------------------

export function PopupRouter() {
  const { state, send, canGoBack, isReady, currentState, context } = useMachine();

  if (!isReady || !context) {
    return (
      <div className="w-[400px] h-[500px] bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 dark:text-slate-500">Loading...</div>
      </div>
    );
  }

  // Compute shell values (Router owns these!)
  const activeTab = computeActiveTab(currentState, context.modalParentState);

  const title = computeTitle(
    currentState,
    context.modalType,
    context.modalParentState,
    context.selectedSubscriptionId
  );

  const hasUnsavedAnswers = !!(
    context.evidenceResponses &&
    context.evidenceResponses.some((r) => r.answer !== null)
  );

  const tabSwitchingDisabled = isTabSwitchingDisabled(
    currentState,
    context.isSaving,
    hasUnsavedAnswers
  );

  // Handle tab change with disable logic
  const handleTabChange = (tab: TabId) => {
    if (tabSwitchingDisabled) {
      toastService.show('Hold on — working...', 'info');
      return;
    }

    // Only change if different tab
    if (tab === activeTab) return;

    // Dispatch navigation event for target tab root
    if (tab === 'scores') send({ type: 'TAB_SCORES' });
    else if (tab === 'subscriptions') send({ type: 'TAB_SUBSCRIPTIONS' });
    else if (tab === 'privacy') send({ type: 'TAB_PRIVACY' });
  };

  // Badge values (only show if > 0)
  const scoreBadge = context.scoreReportCount > 0 ? context.scoreReportCount : undefined;
  const subscriptionBadge = context.subscriptionCount > 0 ? context.subscriptionCount : undefined;

  // Determine which screen to render
  const isModal = currentState === 'ModalOpen';
  const screenState = isModal ? context.modalParentState ?? 'Home' : currentState;
  const ScreenComponent = screens[screenState];

  // Determine modal content
  const ModalContent = context.modalType ? modals[context.modalType] : null;

  return (
    <AppShell
      title={title}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      scoreBadge={scoreBadge}
      subscriptionBadge={subscriptionBadge}
    >
      {/* Screen Content */}
      <ScreenComponent context={context} send={send} canGoBack={canGoBack} />

      {/* Modal Overlay */}
      {isModal && ModalContent && (
        <ModalOverlay onClose={() => send({ type: 'MODAL_CLOSE' })}>
          <ModalContent context={context} send={send} />
        </ModalOverlay>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </AppShell>
  );
}
