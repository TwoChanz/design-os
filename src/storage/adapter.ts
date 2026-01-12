// =============================================================================
// SubSense Chrome Storage Adapter
// =============================================================================

import type { ScoreReport, Subscription, UserSettings } from '../state-machine/types';

// Storage keys
const KEYS = {
  SCORE_REPORTS: 'subsense_score_reports',
  SUBSCRIPTIONS: 'subsense_subscriptions',
  USER_SETTINGS: 'subsense_user_settings',
} as const;

// -----------------------------------------------------------------------------
// Chrome Storage Wrapper
// -----------------------------------------------------------------------------

interface StorageArea {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Use chrome.storage.local in production, localStorage fallback for dev
const chromeStorage: StorageArea = {
  async get<T>(key: string): Promise<T | null> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key] ?? null);
        });
      });
    }
    // Fallback for development
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove(key, resolve);
      });
    }
    localStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(resolve);
      });
    }
    localStorage.clear();
  },
};

// -----------------------------------------------------------------------------
// Storage API
// -----------------------------------------------------------------------------

export const storage = {
  // -------------------------------------------------------------------------
  // Score Reports
  // -------------------------------------------------------------------------

  async getScoreReports(): Promise<ScoreReport[]> {
    const reports = await chromeStorage.get<ScoreReport[]>(KEYS.SCORE_REPORTS);
    return reports ?? [];
  },

  async getScoreReport(id: string): Promise<ScoreReport | null> {
    const reports = await this.getScoreReports();
    return reports.find((r) => r.id === id) ?? null;
  },

  async saveScoreReport(report: ScoreReport): Promise<void> {
    const reports = await this.getScoreReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);

    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.unshift(report); // Add to beginning (most recent first)
    }

    await chromeStorage.set(KEYS.SCORE_REPORTS, reports);
  },

  async deleteScoreReport(id: string): Promise<void> {
    const reports = await this.getScoreReports();
    const filtered = reports.filter((r) => r.id !== id);
    await chromeStorage.set(KEYS.SCORE_REPORTS, filtered);
  },

  async getScoreReportCount(): Promise<number> {
    const reports = await this.getScoreReports();
    return reports.length;
  },

  // -------------------------------------------------------------------------
  // Subscriptions
  // -------------------------------------------------------------------------

  async getSubscriptions(): Promise<Subscription[]> {
    const subs = await chromeStorage.get<Subscription[]>(KEYS.SUBSCRIPTIONS);
    return subs ?? [];
  },

  async getSubscription(id: string): Promise<Subscription | null> {
    const subs = await this.getSubscriptions();
    return subs.find((s) => s.id === id) ?? null;
  },

  async saveSubscription(subscription: Subscription): Promise<void> {
    const subs = await this.getSubscriptions();
    const existingIndex = subs.findIndex((s) => s.id === subscription.id);

    if (existingIndex >= 0) {
      subs[existingIndex] = subscription;
    } else {
      subs.push(subscription);
    }

    await chromeStorage.set(KEYS.SUBSCRIPTIONS, subs);
  },

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<void> {
    const subs = await this.getSubscriptions();
    const index = subs.findIndex((s) => s.id === id);

    if (index >= 0) {
      subs[index] = {
        ...subs[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await chromeStorage.set(KEYS.SUBSCRIPTIONS, subs);
    }
  },

  async deleteSubscription(id: string): Promise<void> {
    const subs = await this.getSubscriptions();
    const filtered = subs.filter((s) => s.id !== id);
    await chromeStorage.set(KEYS.SUBSCRIPTIONS, filtered);
  },

  async getSubscriptionCount(): Promise<number> {
    const subs = await this.getSubscriptions();
    return subs.length;
  },

  async getMonthlyTotal(): Promise<number> {
    const subs = await this.getSubscriptions();
    return subs
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyCost, 0);
  },

  // -------------------------------------------------------------------------
  // User Settings
  // -------------------------------------------------------------------------

  async getUserSettings(): Promise<UserSettings> {
    const settings = await chromeStorage.get<UserSettings>(KEYS.USER_SETTINGS);
    return (
      settings ?? {
        rubricVersion: '1.0.0',
        onboardingSeen: false,
        lastTab: null,
        lastState: null,
      }
    );
  },

  async updateUserSettings(updates: Partial<UserSettings>): Promise<void> {
    const current = await this.getUserSettings();
    await chromeStorage.set(KEYS.USER_SETTINGS, { ...current, ...updates });
  },

  // -------------------------------------------------------------------------
  // Counts (for initial context load)
  // -------------------------------------------------------------------------

  async getCounts(): Promise<{ scoreReportCount: number; subscriptionCount: number }> {
    const [scoreReportCount, subscriptionCount] = await Promise.all([
      this.getScoreReportCount(),
      this.getSubscriptionCount(),
    ]);
    return { scoreReportCount, subscriptionCount };
  },

  // -------------------------------------------------------------------------
  // Clear All
  // -------------------------------------------------------------------------

  async clearAll(): Promise<void> {
    await Promise.all([
      chromeStorage.remove(KEYS.SCORE_REPORTS),
      chromeStorage.remove(KEYS.SUBSCRIPTIONS),
    ]);
    // Keep user settings (rubricVersion, etc.)
  },
};
