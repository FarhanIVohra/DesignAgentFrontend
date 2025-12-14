import React from 'react'

export default function LoadingSpinner({ size = 12 }) {
  const s = `${size}rem` // not used, kept for API
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 dark:border-t-sky-400 animate-spin" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }} />
        <div className="absolute inset-0 rounded-full opacity-25 bg-gradient-to-br from-transparent to-blue-100 dark:to-slate-800 animate-pulse" />
      </div>
      <div className="text-sm muted">Processing</div>
    </div>
  )
}
