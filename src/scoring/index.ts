// =============================================================================
// SubSense Scoring Engine — Public API
// =============================================================================

// Main scoring function
export { scoreSignals, type ScoringInput, type ScoringOutput, type ManualAnswers } from './scorer';

// Background service worker
export {
  handleMessage,
  getMockSignals,
  registerBackgroundListeners,
  type BackgroundMessage,
  type BackgroundResponse,
} from './background';

// Extractor (for content script)
export { extractSignals, handleExtractRequest, type ExtractedSignals } from './extractor';
