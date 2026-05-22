'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Announcement, db } from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Bookmark, FileText, Pin, Calendar, ArrowUpRight } from 'lucide-react'

interface NoticeCardProps {
  notice: Announcement
  isFeatured?: boolean
}

export default function NoticeCard({ notice, isFeatured = false }: NoticeCardProps) {
  const { user, toggleBookmark } = useAuth()
  const { showToast } = useNotification()
  const [bookmarked, setBookmarked] = useState(false)
  const [deptName, setDeptName] = useState('')

  useEffect(() => {
    if (user) {
      setBookmarked(user.bookmarks.includes(notice.id))
    } else {
      setBookmarked(false)
    }
  }, [user, notice.id])

  useEffect(() => {
    async function loadDept() {
      const depts = await db.getDepartments()
      const match = depts.find((d) => d.id === notice.department_id)
      setDeptName(match ? match.name : 'General')
    }
    loadDept()
  }, [notice.department_id])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      showToast('Please log in (or switch role in header) to bookmark notices.', 'warning')
      return
    }
    const ok = await toggleBookmark(notice.id)
    if (ok) {
      const newBookmarked = !bookmarked
      setBookmarked(newBookmarked)
      showToast(
        newBookmarked ? 'Announcement bookmarked!' : 'Bookmark removed',
        'success'
      )
    }
  }

  // Priority styling config
  const priorityMap = {
    HIGH: { bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' },
    MEDIUM: { bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    LOW: { bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  }

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ${
        isFeatured ? 'border-l-4 border-l-blue-500' : ''
      }`}
    >
      
      {/* Top Banner Row */}
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
              priorityMap[notice.priority].bg
            }`}>
              {notice.priority}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800 uppercase tracking-wider">
              {notice.category}
            </span>
          </div>

          {/* Icons (Pin and Bookmark) */}
          <div className="flex items-center gap-1">
            {notice.pinned && (
              <Pin className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 rotate-45 mr-1" title="Pinned Announcement" />
            )}
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 transition"
              title={bookmarked ? 'Remove Bookmark' : 'Save Notice'}
            >
              <Bookmark className={`w-4.5 h-4.5 ${bookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>
          </div>

        </div>

        {/* Title */}
        <Link href={`/announcements/${notice.slug}`} className="group">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors flex items-start gap-1">
            <span className="line-clamp-2">{notice.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1" />
          </h3>
        </Link>

        {/* Short summary / text snippet */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mt-2 mb-4 leading-relaxed font-light">
          {notice.content}
        </p>
      </div>

      {/* Footer Info Row */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
        
        {/* Department Name */}
        <span className="truncate max-w-[120px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          {deptName.replace('Department of ', '')}
        </span>

        {/* Date and attachment check */}
        <div className="flex items-center gap-2">
          {notice.pdf_url && (
            <FileText className="w-4 h-4 text-rose-500" title="PDF Attachment Included" />
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(notice.published_at)}
          </span>
        </div>

      </div>

    </motion.div>
  )
}
