import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-slate-400">
        © {new Date().getFullYear()} DesignAgent — Autonomous Design Iteration with FIBO
      </div>
    </footer>
  )
}
