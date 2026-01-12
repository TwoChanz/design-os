// =============================================================================
// SubSense Popup State Machine — Types
// Version: 1.2.0
// =============================================================================

// -----------------------------------------------------------------------------
// Data Model Types
// -----------------------------------------------------------------------------

export type RatingLabel = 'Clear' | 'Mixed' | 'Risky';
export type Confidence = 'high' | 'medium' | 'low';
export type EvidenceSource = 'detected' | 'user_input';
export type CategoryKey = 'pricing' | 'trials' | 'cancellation' | 'data' | 'permissions';
export type SubscriptionStatus = 'active' | 'paused' | 'canceled';
export type TriStateAnswer = 'yes' | 'no' | 'not_sure';

export interface CategoryScore {
  category: CategoryKey;
  label: string;
  score: number;
}

export interface EvidenceItem {
  key: string;
  label: string;
  value: boolean;
  source: EvidenceSource;
  confidence: Confidence;
}

export interface ScoreReport {
  id: string;
  createdAt: string;
  domain: string;
  url: string;
  overallScore: number;
  ratingLabel: RatingLabel;
  confidence: Confidence;
  categoryScores: CategoryScore[];
  evidenceItems: EvidenceItem[];
  notes: string | null;
}

export interface EvidenceResponse {
  questionId: string;
  question: string;
  answer: TriStateAnswer | null;
}

export interface Subscription {
  id: string;
  name: string;
  domain: string | null;
  monthlyCost: number;
  status: SubscriptionStatus;
  renewalDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  rubricVersion: string;
  onboardingSeen: boolean;
  lastTab: TabId | null;
  lastState: StateId | null;
}

// -----------------------------------------------------------------------------
// State Machine Types
// -----------------------------------------------------------------------------

export type TabId = 'scores' | 'subscriptions' | 'privacy';

export type StateId =
  | 'Home'
  | 'Loading'
  | 'Result'
  | 'EvidencePrompt'
  | 'ErrorCSP'
  | 'ErrorPermission'
  | 'MyScores'
  | 'ScoreDetail'
  | 'Subscriptions'
  | 'Privacy'
  | 'ModalOpen';

export type ModalType = 'subscriptionForm' | 'confirmDelete' | 'confirmClearAll';

export type PermissionStatus = 'granted' | 'denied' | 'prompt';

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

export interface PopupContext {
  // Navigation
  activeTab: TabId;

  // Current page info (from active tab)
  currentDomain: string | null;
  currentUrl: string | null;

  // Scoring flow
  currentScoreReport: ScoreReport | null;
  evidenceResponses: EvidenceResponse[] | null;
  isManualScore: boolean;

  // Selection
  selectedReportId: string | null;
  selectedSubscriptionId: string | null;

  // Modal state
  modalType: ModalType | null;
  modalParentState: StateId | null;

  // Async indicators
  isSubmitting: boolean;
  isSharing: boolean;
  isSaving: boolean;

  // Page access
  permissionStatus: PermissionStatus | null;
  pageAccessible: boolean | null;

  // Counts (loaded from storage)
  scoreReportCount: number;
  subscriptionCount: number;

  // Error
  error: Error | null;

  // Prefill for subscription from score domain
  prefillDomain?: string;
}

export const initialContext: PopupContext = {
  activeTab: 'scores',
  currentDomain: null,
  currentUrl: null,
  currentScoreReport: null,
  evidenceResponses: null,
  isManualScore: false,
  selectedReportId: null,
  selectedSubscriptionId: null,
  modalType: null,
  modalParentState: null,
  isSubmitting: false,
  isSharing: false,
  isSaving: false,
  permissionStatus: null,
  pageAccessible: null,
  scoreReportCount: 0,
  subscriptionCount: 0,
  error: null,
};

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

export type PopupEvent =
  // Scoring flow
  | { type: 'SCORE_PAGE' }
  | { type: 'SCORE_SUCCESS'; payload: ScoreReport }
  | { type: 'SCORE_LOW_CONFIDENCE'; payload: ScoreReport }
  | { type: 'SCORE_ERROR_CSP'; payload: Error }
  | { type: 'SCORE_ERROR_PERMISSION'; payload: Error }

  // Result actions
  | { type: 'BACK' }
  | { type: 'ANSWER_QUESTIONS' }
  | { type: 'SAVE' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_FAILURE'; payload: Error }
  | { type: 'SHARE' }
  | { type: 'SHARE_SUCCESS' }
  | { type: 'SHARE_FAILURE'; payload: Error }
  | { type: 'ADD_SUBSCRIPTION' }

  // Evidence prompt
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: TriStateAnswer } }
  | { type: 'SUBMIT' }
  | { type: 'RECALC_SUCCESS'; payload: ScoreReport }
  | { type: 'RECALC_FAILURE'; payload: Error }

  // Error states
  | { type: 'ANSWER_MANUAL' }
  | { type: 'GRANT_PERMISSION' }
  | { type: 'PERMISSION_GRANTED' }
  | { type: 'PERMISSION_DENIED' }

  // Score reports
  | { type: 'VIEW_HISTORY' }
  | { type: 'SELECT_REPORT'; payload: string }
  | { type: 'DELETE' }
  | { type: 'DELETE_SCORE_SUCCESS' }
  | { type: 'DELETE_SCORE_FAILURE'; payload: Error }

  // Subscriptions
  | { type: 'EDIT_SUBSCRIPTION'; payload: string }
  | { type: 'DELETE_SUBSCRIPTION'; payload: string }
  | { type: 'SAVE_SUBSCRIPTION'; payload: Partial<Subscription> }
  | { type: 'SAVE_SUBSCRIPTION_SUCCESS' }
  | { type: 'SAVE_SUBSCRIPTION_FAILURE'; payload: Error }
  | { type: 'DELETE_SUBSCRIPTION_SUCCESS' }
  | { type: 'DELETE_SUBSCRIPTION_FAILURE'; payload: Error }

  // Modal
  | { type: 'MODAL_CLOSE' }
  | { type: 'DELETE_CONFIRMED' }
  | { type: 'CANCEL' }

  // Privacy
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'CLEAR_ALL_SUCCESS' }
  | { type: 'CLEAR_ALL_FAILURE'; payload: Error }

  // Tab navigation
  | { type: 'TAB_SCORES' }
  | { type: 'TAB_SUBSCRIPTIONS' }
  | { type: 'TAB_PRIVACY' };

// -----------------------------------------------------------------------------
// State Configuration
// -----------------------------------------------------------------------------

export interface StateConfig {
  id: StateId;
  tab: TabId | 'inherit';
  description: string;
  async?: boolean;
  overlay?: boolean;
  persisted?: boolean;
  backDisabled?: boolean;
}

export const STATE_CONFIG: Record<StateId, StateConfig> = {
  Home: { id: 'Home', tab: 'scores', description: 'Initial state with Score this page CTA' },
  Loading: { id: 'Loading', tab: 'scores', description: 'Scoring in progress', async: true, backDisabled: true },
  Result: { id: 'Result', tab: 'scores', description: 'Score result displayed' },
  EvidencePrompt: { id: 'EvidencePrompt', tab: 'scores', description: '3-question form for manual input' },
  ErrorCSP: { id: 'ErrorCSP', tab: 'scores', description: 'Page blocked by CSP or restrictions' },
  ErrorPermission: { id: 'ErrorPermission', tab: 'scores', description: 'Extension lacks host permission' },
  MyScores: { id: 'MyScores', tab: 'scores', description: 'List of saved score reports', persisted: true },
  ScoreDetail: { id: 'ScoreDetail', tab: 'scores', description: 'Single score report detail view' },
  Subscriptions: { id: 'Subscriptions', tab: 'subscriptions', description: 'Subscription list with monthly total', persisted: true },
  Privacy: { id: 'Privacy', tab: 'privacy', description: 'Privacy promise static view' },
  ModalOpen: { id: 'ModalOpen', tab: 'inherit', description: 'Overlay state for modals', overlay: true },
};

// -----------------------------------------------------------------------------
// Machine State
// -----------------------------------------------------------------------------

export interface MachineState {
  current: StateId;
  context: PopupContext;
  history: StateId[];
}
