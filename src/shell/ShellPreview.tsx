'use client'

import React, { useState } from 'react'
import { AppShell } from './components/AppShell'
import type { TabId } from './components/TabBar'

// Map tab to default title
const tabTitles: Record<TabId, string> = {
  scores: 'Score',
  subscriptions: 'Subscriptions',
  privacy: 'Privacy',
}

export default function ShellPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('scores')

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 dark:bg-slate-800 p-8">
      {/* Extension popup container with shadow to simulate popup */}
      <div className="rounded-lg shadow-2xl overflow-hidden">
        <AppShell
          title={tabTitles[activeTab]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          scoreBadge={3}
          subscriptionBadge={5}
        >
          {/* Demo content for each tab */}
          <div className="p-6">
            {activeTab === 'scores' && (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Score this page
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Analyze the current page for pricing transparency, trial terms, and more.
                  </p>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Score this page
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Monthly total</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">$127.94</span>
                </div>
                {['Netflix', 'Spotify', 'GitHub Pro', 'Figma', 'ChatGPT Plus'].map((name, i) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      ${[15.99, 9.99, 4.0, 12.0, 20.0][i]}/mo
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Your data stays local
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      All scores stored locally in your browser
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      No accounts, no sign-up required
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      No telemetry or analytics by default
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Pages analyzed on-demand only
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AppShell>
      </div>
    </div>
  )
}
