import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const baseBtn = 'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition transform';
  const hover = 'hover:shadow-md hover:-translate-y-0.5';

  return (
    <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-3">
            {/* CSS-only visual logo: overlapping shapes + initials */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 transform rotate-12" />
              <div className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-yellow-400/90 shadow-md" />
              <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-400/90 shadow-sm" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">DA</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">DesignAgent</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Image design assistant</div>
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-3">
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              `${baseBtn} ${hover} ${isActive ? 'bg-indigo-600 text-white shadow' : 'bg-indigo-500/90 text-white hover:bg-indigo-600'}`
            }
          >
            Generate
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${baseBtn} ${hover} ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border' : 'bg-transparent text-slate-700 dark:text-slate-200 border border-transparent hover:bg-slate-50'}`
            }
          >
            History
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `${baseBtn} ${hover} ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border' : 'bg-transparent text-slate-700 dark:text-slate-200 border border-transparent hover:bg-slate-50'}`
            }
          >
            Compare
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
