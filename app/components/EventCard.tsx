'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CampusEvent, db } from '../lib/db'
import { useNotification } from '../context/NotificationContext'
import { Calendar, MapPin, Award, CheckCircle, Clock } from 'lucide-react'

interface EventCardProps {
  event: CampusEvent
}

export default function EventCard({ event }: EventCardProps) {
  const { showToast } = useNotification()
  const [registered, setRegistered] = useState(false)
  const [deptName, setDeptName] = useState('')
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  })

  useEffect(() => {
    // Load department name
    async function loadDept() {
      const depts = await db.getDepartments()
      const match = depts.find((d) => d.id === event.department_id)
      setDeptName(match ? match.name : 'General')
    }
    loadDept()

    // Read registration from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`nh_reg_${event.id}`)
      if (saved === 'true') {
        setRegistered(true)
      }
    }
  }, [event.department_id, event.id])

  // Countdown clock loop
  useEffect(() => {
    const target = new Date(event.date_time).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft((prev) => ({ ...prev, ended: true }))
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, ended: false })
    };

    updateTimer() // run once immediately
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [event.date_time])

  const handleRegister = () => {
    if (registered) {
      setRegistered(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nh_reg_${event.id}`)
      }
      showToast(`Registration canceled for: ${event.title}`, 'info')
    } else {
      setRegistered(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`nh_reg_${event.id}`, 'true')
      }
      showToast(`Registration successful! See you at ${event.venue}.`, 'success')
    }
  }

  const handleCalendar = () => {
    // Generate simple Google Calendar URL
    const startStr = new Date(event.date_time)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '')
    const endStr = new Date(new Date(event.date_time).getTime() + 1000 * 60 * 60 * 2) // 2 hours duration
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '')

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.venue)}`

    window.open(url, '_blank')
    showToast('Redirecting to Google Calendar...', 'info')
  }

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between max-w-sm w-full mx-auto"
    >
      
      {/* Event banner */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        {event.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-900">
            <Award className="w-12 h-12 text-blue-400" />
          </div>
        )}

        {/* Featured Tag badge */}
        {event.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow">
            Featured
          </span>
        )}

        {/* Live Timer Overlaid */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-1.5 text-xs text-white">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          {timeLeft.ended ? (
            <span className="font-bold text-rose-400">Ended</span>
          ) : (
            <span className="font-mono font-bold tracking-tight">
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Department Tag & Category */}
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold tracking-wide uppercase text-blue-500">
            <span>{deptName.split(' ')[0]} Department</span>
            <span>•</span>
            <span className="text-slate-400">{event.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white mb-2 leading-snug line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-light">
            {event.description}
          </p>

          {/* Logistics */}
          <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{formatDate(event.date_time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={handleRegister}
            disabled={timeLeft.ended}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              registered
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-500/10'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-55'
            }`}
          >
            {registered ? (
              <>
                <CheckCircle className="w-4.5 h-4.5" />
                <span>Registered</span>
              </>
            ) : (
              <span>Register Now</span>
            )}
          </button>

          <button
            onClick={handleCalendar}
            className="py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
          >
            Add to Calendar
          </button>
        </div>

      </div>

    </motion.div>
  )
}
