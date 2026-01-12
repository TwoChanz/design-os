// =============================================================================
// SubSense Popup Router
// =============================================================================

import React from 'react';
import { useMachine } from '../hooks/useMachine';
import type { StateId, ModalType } from '../state-machine/types';

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
import { TabsNav } from './components/TabsNav';
import { ToastContainer } from './components/ToastContainer';
import { ModalOverlay } from './components/ModalOverlay';

// Modal content components
import { SubscriptionFormModal } from './modals/SubscriptionFormModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { ConfirmClearAllModal } from './modals/ConfirmClearAllModal';

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
// Popup Router Component
// -----------------------------------------------------------------------------

export function PopupRouter() {
  const { state, send, canGoBack, isReady, currentState, context } = useMachine();

  if (!isReady || !context) {
    return (
      <div className="w-[360px] h-[540px] bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // Determine which screen to render
  const isModal = currentState === 'ModalOpen';
  const screenState = isModal ? context.modalParentState ?? 'Home' : currentState;
  const ScreenComponent = screens[screenState];

  // Determine modal content
  const ModalContent = context.modalType ? modals[context.modalType] : null;

  return (
    <div className="w-[360px] h-[540px] bg-slate-50 flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <TabsNav
        activeTab={context.activeTab}
        onTabChange={(tab) => {
          if (tab === 'scores') send({ type: 'TAB_SCORES' });
          else if (tab === 'subscriptions') send({ type: 'TAB_SUBSCRIPTIONS' });
          else if (tab === 'privacy') send({ type: 'TAB_PRIVACY' });
        }}
      />

      {/* Screen Content */}
      <div className="flex-1 overflow-auto">
        <ScreenComponent context={context} send={send} canGoBack={canGoBack} />
      </div>

      {/* Modal Overlay */}
      {isModal && ModalContent && (
        <ModalOverlay onClose={() => send({ type: 'MODAL_CLOSE' })}>
          <ModalContent context={context} send={send} />
        </ModalOverlay>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
