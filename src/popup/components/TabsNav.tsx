// =============================================================================
// TabsNav Component
// =============================================================================

import React from 'react';
import type { TabId } from '../../state-machine/types';

interface TabsNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'scores', label: 'Scores' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'privacy', label: 'Privacy' },
];

export function TabsNav({ activeTab, onTabChange }: TabsNavProps) {
  return (
    <nav className="flex border-b border-slate-200 bg-white px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-1 py-3 text-sm font-medium transition-colors
            ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
