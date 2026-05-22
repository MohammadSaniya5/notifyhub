'use client'

import React, { useEffect, useState } from 'react'
import { db, StudentQuery, Department } from '../../lib/db'
import { useNotification } from '../../context/NotificationContext'
import { MessageSquare, Check, Trash2, Mail, Landmark, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminQueries() {
  const { showToast } = useNotification()
  const [queries, setQueries] = useState<StudentQuery[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('PENDING')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const q = await db.getQueries()
      const d = await db.getDepartments()
      setQueries(q)
      setDepartments(d)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleResolve = async (id: string) => {
    const ok = await db.resolveQuery(id)
    if (ok) {
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, resolved: true } : q))
      )
      showToast('Student ticket marked as RESOLVED.', 'success')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this query ticket?')) {
      const ok = await db.deleteQuery(id)
      if (ok) {
        setQueries((prev) => prev.filter((q) => q.id !== id))
        showToast('Ticket deleted from logs.', 'success')
      }
    }
  }

  const getDeptName = (id: string) => {
    const match = departments.find((d) => d.id === id)
    return match ? match.name : 'General Academic Admin'
  }

  const filteredQueries = queries.filter((q) => {
    if (activeFilter === 'PENDING') return !q.resolved
    if (activeFilter === 'RESOLVED') return q.resolved
    return true
  })

  return (
    <div className="flex flex-col gap-6 text-slate-800 dark:text-slate-200">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Student Query Inbox</h1>
          <p className="text-xs text-slate-400 mt-1">Read, manage, and resolve student academic inquiries.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          {(['PENDING', 'RESOLVED', 'ALL'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold transition uppercase tracking-wide ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Queries Inbox Feed */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : filteredQueries.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 text-center text-slate-500 border-slate-800 flex flex-col items-center gap-3">
          <MessageSquare className="w-12 h-12 text-slate-500" />
          <span className="font-bold text-sm">No ticket matches active category filters.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredQueries.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card rounded-3xl p-5 border flex flex-col justify-between gap-4 transition duration-200 ${
                q.resolved
                  ? 'border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/10 opacity-70'
                  : 'border-blue-500/20 bg-blue-500/[0.01]'
              }`}
            >
              
              {/* Header Info */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{q.name}</h3>
                  
                  {/* Email & Dept logs */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1 flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-500" /> {q.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-emerald-500" /> {getDeptName(q.department_id)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(q.created_at).toLocaleDateString()}
                  </span>
                  
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    q.resolved ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {q.resolved ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Message text */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                {q.message}
              </p>

              {/* Actions row */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                {!q.resolved && (
                  <button
                    onClick={() => handleResolve(q.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition shadow shadow-emerald-500/10"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(q.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-[10px] font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Ticket
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  )
}
