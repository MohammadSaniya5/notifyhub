'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { db, Announcement } from '../lib/db'
import { Megaphone, AlertCircle } from 'lucide-react'

export default function ActiveTicker() {
  const [items, setItems] = useState<Announcement[]>([])

  useEffect(() => {
    async function fetchTickerItems() {
      const all = await db.getAnnouncements()
      // Filter pinned or high priority announcements
      const relevant = all.filter((a) => a.pinned || a.priority === 'HIGH')
      setItems(relevant.length > 0 ? relevant : all.slice(0, 4))
    }
    fetchTickerItems()

    const handleRealtime = () => {
      fetchTickerItems()
    }
    window.addEventListener('nh_realtime_notice', handleRealtime)
    return () => window.removeEventListener('nh_realtime_notice', handleRealtime)
  }, [])

  if (items.length === 0) return null

  // Duplicate items to ensure smooth continuous marquee effect
  const marqueeItems = [...items, ...items, ...items]

  return (
    <div className="w-full py-2.5 px-4 overflow-hidden border-y border-slate-200/50 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900/60 flex items-center gap-3 select-none">
      
      {/* Live Badge indicator */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-500/20">
        <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping inline-block" />
        <span>LIVE UPDATES</span>
      </div>

      {/* Scrolling container */}
      <div className="flex-1 overflow-hidden relative w-full flex items-center">
        <motion.div
          className="flex whitespace-nowrap gap-10"
          animate={{ x: [0, -1000] }}
          transition={{
            ease: 'linear',
            duration: 25,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ display: 'inline-flex' }}
        >
          {marqueeItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/announcements/${item.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:text-blue-500 transition-colors"
            >
              {item.priority === 'HIGH' ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <Megaphone className="w-4 h-4 text-blue-500 shrink-0" />
              )}
              <span className="font-semibold text-slate-950 dark:text-white">
                {item.title}
              </span>
              <span className="text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                {item.category}
              </span>
              <span className="text-slate-400 dark:text-slate-600 font-light">|</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
