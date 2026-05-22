'use client'

import React from 'react'
import { Share2 } from 'lucide-react'
import { useNotification } from '../../../context/NotificationContext'

export default function ShareButtonClient() {
  const { showToast } = useNotification()

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      showToast('Announcement URL copied to clipboard!', 'success')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      title="Share notice"
    >
      <Share2 className="w-4 h-4" /> Share URL
    </button>
  )
}
