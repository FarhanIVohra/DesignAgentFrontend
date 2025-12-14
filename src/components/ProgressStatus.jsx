import React, { useEffect, useState } from 'react'

export default function ProgressStatus({ step = 0, total = 100, messages = null }) {
  const percent = Math.max(0, Math.min(100, Math.round((step / total) * 100)))
  const defaultMessages = [
    'Preparing assets',
    'Running iterations',
    'Finalizing results',
    'Almost there'
  ]
  const msgs = messages || defaultMessages
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 2500)
    return () => clearInterval(t)
  }, [msgs.length])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs muted">{msgs[idx]}</div>
        <div className="text-xs muted">{percent}%</div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
