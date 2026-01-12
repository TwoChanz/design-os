import React from 'react'
import { Header } from './Header'
import { TabBar, type TabId } from './TabBar'

interface AppShellProps {
  children: React.ReactNode
  title: string
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  scoreBadge?: number
  subscriptionBadge?: number
}

export function AppShell({
  children,
  title,
  activeTab,
  onTabChange,
  scoreBadge,
  subscriptionBadge,
}: AppShellProps) {
  return (
    <div className="w-[400px] min-h-[400px] max-h-[600px] flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Fixed Header */}
      <Header title={title} />

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Fixed Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        scoreBadge={scoreBadge}
        subscriptionBadge={subscriptionBadge}
      />
    </div>
  )
}
