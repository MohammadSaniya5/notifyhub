'use client'

import React, { useEffect, useState } from 'react'
import { db, Announcement, Department } from '../../lib/db'
import { useNotification } from '../../context/NotificationContext'
import { Plus, Edit3, Trash2, Pin, CheckCircle, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminNotices() {
  const { showToast, playAlertSound } = useNotification()
  
  // Lists
  const [notices, setNotices] = useState<Announcement[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  
  // UI Panels
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Announcement | null>(null)
  
  // Form parameters
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW')
  const [departmentId, setDepartmentId] = useState('GEN')
  const [pinned, setPinned] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    async function loadData() {
      const n = await db.getAnnouncements()
      const d = await db.getDepartments()
      setNotices(n)
      setDepartments(d)
    }
    loadData()
  }, [])

  // Auto generate AI summaries mockup helper
  const handleAutoSummary = () => {
    if (!content.trim()) {
      showToast('Type some announcement content first to summarize!', 'warning')
      return
    }
    // Take first 3 sentences of content and split into bullets
    const sentences = content
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 5)
      .slice(0, 3)

    const bulletFormat = sentences
      .map((s, idx) => `${idx + 1}. ${s.trim()}`)
      .join('\n')
    
    setSummary(bulletFormat)
    showToast('AI Summary bullets generated from content!', 'success')
  }

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingNotice(null)
    setTitle('')
    setContent('')
    setCategory('General')
    setPriority('LOW')
    setDepartmentId('GEN')
    setPinned(false)
    setPdfUrl('')
    setSummary('')
    setModalOpen(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (n: Announcement) => {
    setEditingNotice(n)
    setTitle(n.title)
    setContent(n.content)
    setCategory(n.category)
    setPriority(n.priority)
    setDepartmentId(n.department_id)
    setPinned(n.pinned)
    setPdfUrl(n.pdf_url || '')
    setSummary(n.summary || '')
    setModalOpen(true)
  }

  // Delete Notice
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      const ok = await db.deleteAnnouncement(id)
      if (ok) {
        setNotices((prev) => prev.filter((n) => n.id !== id))
        showToast('Announcement deleted successfully.', 'success')
      }
    }
  }

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required.', 'warning')
      return
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const payload = {
      title,
      slug,
      content,
      category,
      priority,
      department_id: departmentId,
      pinned,
      pdf_url: pdfUrl.trim() ? pdfUrl.trim() : undefined,
      summary: summary.trim() ? summary.trim() : '1. Key academic update released.\n2. Verify criteria details.\n3. Contact department offices.',
      published_at: new Date().toISOString(),
    }

    try {
      if (editingNotice) {
        const res = await db.updateAnnouncement(editingNotice.id, payload)
        if (res) {
          setNotices((prev) => prev.map((n) => (n.id === editingNotice.id ? res : n)))
          showToast('Announcement updated successfully!', 'success')
        }
      } else {
        const res = await db.createAnnouncement(payload)
        setNotices((prev) => [res, ...prev])
        showToast('New announcement published to student boards!', 'success')
        
        // Trigger emergency chime if HIGH priority
        if (priority === 'HIGH') {
          playAlertSound()
        }
      }
      setModalOpen(false)
    } catch (err) {
      showToast('Error saving announcement.', 'error')
      console.error(err)
    }
  }

  // Toggle Pinned Directly
  const togglePinDirectly = async (n: Announcement) => {
    const updated = await db.updateAnnouncement(n.id, { pinned: !n.pinned })
    if (updated) {
      setNotices((prev) => prev.map((item) => (item.id === n.id ? updated : item)))
      showToast(updated.pinned ? 'Announcement pinned!' : 'Announcement unpinned.', 'success')
    }
  }

  return (
    <div className="flex flex-col gap-6 text-slate-800 dark:text-slate-200">
      
      {/* Title block */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Manage Campus Notices</h1>
          <p className="text-xs text-slate-400 mt-1">Publish, edit, or archive official college announcements.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Create Notice
        </button>
      </div>

      {/* Notices Table / List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Logs</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">No notices active. Click "Create Notice" to get started.</td>
                </tr>
              ) : (
                notices.map((n) => (
                  <tr
                    key={n.id}
                    className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePinDirectly(n)}
                          className="shrink-0"
                          title={n.pinned ? 'Unpin' : 'Pin to Home Ticker'}
                        >
                          <Pin className={`w-4 h-4 ${n.pinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400 hover:text-amber-400'}`} />
                        </button>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{n.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{n.category}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        n.priority === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-500'
                          : n.priority === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {n.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {n.pdf_url && <FileText className="w-4 h-4 text-rose-500 inline-block mr-1" title="Has attachment" />}
                      <span>{new Date(n.published_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(n)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition"
                          title="Edit Notice"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Creation & Editor Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 text-xs shadow-2xl"
            >
              
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-5">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingNotice ? '✏️ Edit Campus Notice' : '📢 Publish New Announcement'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">Notice Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. End Semester Examinations Registration Slots June 2026"
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                  />
                </div>

                {/* Sub row config */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    >
                      {['Exams', 'Placements', 'Events', 'Holidays', 'Workshops', 'General'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Priority Scale</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs text-rose-500"
                    >
                      <option value="LOW">LOW (Blue Badge)</option>
                      <option value="MEDIUM">MEDIUM (Yellow Badge)</option>
                      <option value="HIGH">HIGH (Red Beacon Alert)</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Assigned Dept</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name.replace('Department of ', '')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">Notice Description / Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide full notification board descriptions here..."
                    rows={6}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none text-xs resize-none"
                  />
                </div>

                {/* PDF Attachment URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">PDF Attachment URL (Optional)</label>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="e.g. https://www.university.edu/notices/exam-timetable.pdf"
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none text-xs"
                  />
                </div>

                {/* AI Summary bullets generation helper */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">AI Bullet Point summaries (Newline separated)</label>
                    <button
                      type="button"
                      onClick={handleAutoSummary}
                      className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-lg transition"
                    >
                      ✨ Auto Generate Summary
                    </button>
                  </div>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="1. First bullet rule&#10;2. Second bullet rule&#10;3. Third bullet rule"
                    rows={3}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none text-xs resize-none"
                  />
                </div>

                {/* Pinned toggle status */}
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="pinned_toggle"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-800 shrink-0"
                  />
                  <label htmlFor="pinned_toggle" className="font-semibold text-slate-300 cursor-pointer select-none">
                    📌 Pin this notice to front marquee and spotlight carousel
                  </label>
                </div>

                {/* Save Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition text-xs mt-2"
                >
                  {editingNotice ? 'Update Announcement' : 'Publish Announcement'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
