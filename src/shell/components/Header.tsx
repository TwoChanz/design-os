import React from 'react'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-12 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      {/* Wordmark */}
      <span className="text-sm font-medium text-slate-400 dark:text-slate-500 tracking-wide">
        SubSense
      </span>

      {/* Dynamic Title */}
      <h1 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h1>
    </header>
  )
}
