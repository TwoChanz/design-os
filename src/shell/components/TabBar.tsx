import React from 'react'
import { Shield, CreditCard, Lock } from 'lucide-react'

export type TabId = 'scores' | 'subscriptions' | 'privacy'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  scoreBadge?: number
  subscriptionBadge?: number
}

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'scores', label: 'Scores', icon: Shield },
  { id: 'subscriptions', label: 'Subs', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Lock },
]

export function TabBar({ activeTab, onTabChange, scoreBadge, subscriptionBadge }: TabBarProps) {
  const getBadge = (tabId: TabId): number | undefined => {
    if (tabId === 'scores') return scoreBadge
    if (tabId === 'subscriptions') return subscriptionBadge
    return undefined
  }

  return (
    <nav className="h-16 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="h-full flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          const badge = getBadge(tab.id)

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg
                transition-colors duration-150
                ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-blue-600 rounded-full">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
