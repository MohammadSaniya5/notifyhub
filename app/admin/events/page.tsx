'use client'

import React, { useEffect, useState } from 'react'
import { db, CampusEvent, Department } from '../../lib/db'
import { useNotification } from '../../context/NotificationContext'
import { Plus, Edit3, Trash2, Calendar, Award, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminEvents() {
  const { showToast } = useNotification()
  
  // Lists
  const [events, setEvents] = useState<CampusEvent[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null)
  
  // Form parameters
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [venue, setVenue] = useState('')
  const [category, setCategory] = useState('Events')
  const [departmentId, setDepartmentId] = useState('GEN')
  const [registrationDeadline, setRegistrationDeadline] = useState('')
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    async function loadData() {
      const e = await db.getEvents()
      const d = await db.getDepartments()
      setEvents(e)
      setDepartments(d)
    }
    loadData()
  }, [])

  // Open modal Create
  const handleOpenCreate = () => {
    setEditingEvent(null)
    setTitle('')
    setDescription('')
    setBannerUrl('')
    
    // Set default dates to tomorrow
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24)
    const tomorrowISO = tomorrow.toISOString().slice(0, 16)
    setDateTime(tomorrowISO)
    setRegistrationDeadline(tomorrowISO)
    
    setVenue('')
    setCategory('Events')
    setDepartmentId('GEN')
    setFeatured(false)
    setModalOpen(true)
  }

  // Open modal Edit
  const handleOpenEdit = (e: CampusEvent) => {
    setEditingEvent(e)
    setTitle(e.title)
    setDescription(e.description)
    setBannerUrl(e.banner_url || '')
    setDateTime(new Date(e.date_time).toISOString().slice(0, 16))
    setVenue(e.venue)
    setCategory(e.category)
    setDepartmentId(e.department_id)
    setRegistrationDeadline(new Date(e.registration_deadline).toISOString().slice(0, 16))
    setFeatured(e.featured)
    setModalOpen(true)
  }

  // Delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const ok = await db.deleteEvent(id)
      if (ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
        showToast('Event removed from student boards.', 'success')
      }
    }
  }

  // Submit Handler
  const handleSave = async (formE: React.FormEvent) => {
    formE.preventDefault()

    if (!title.trim() || !description.trim() || !venue.trim()) {
      showToast('Please fill in all required event details.', 'warning')
      return
    }

    const payload = {
      title,
      description,
      banner_url: bannerUrl.trim() ? bannerUrl.trim() : 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      date_time: new Date(dateTime).toISOString(),
      venue,
      category,
      department_id: departmentId,
      registration_deadline: new Date(registrationDeadline).toISOString(),
      featured,
    }

    try {
      if (editingEvent) {
        const res = await db.updateEvent(editingEvent.id, payload)
        if (res) {
          setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? res : e)))
          showToast('Event updated successfully!', 'success')
        }
      } else {
        const res = await db.createEvent(payload)
        setEvents((prev) => [...prev, res])
        showToast('New dynamic campus event published!', 'success')
      }
      setModalOpen(false)
    } catch (err) {
      showToast('Error saving campus event.', 'error')
      console.error(err)
    }
  }

  // Quick toggle featured state directly
  const toggleFeaturedDirectly = async (e: CampusEvent) => {
    const updated = await db.updateEvent(e.id, { featured: !e.featured })
    if (updated) {
      setEvents((prev) => prev.map((item) => (item.id === e.id ? updated : item)))
      showToast(updated.featured ? 'Event set to featured spotlight!' : 'Event removed from spotlight.', 'success')
    }
  }

  return (
    <div className="flex flex-col gap-6 text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Manage Campus Events</h1>
          <p className="text-xs text-slate-400 mt-1">Publish workshops, hackathons, seminars, or college fests.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Publish Event
        </button>
      </div>

      {/* Events Table List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Venue & Log</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Spotlight</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">No events currently scheduled. Click "Publish Event".</td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{e.title}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{e.venue}</div>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-wide">{e.category}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{new Date(e.date_time).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeaturedDirectly(e)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold border transition uppercase ${
                          e.featured
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {e.featured ? <Check className="w-3 h-3 text-amber-500" /> : null}
                        <span>{e.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(e)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition"
                          title="Delete Event"
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

      {/* CRUD Event Editor Modal Overlay */}
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
                  {editingEvent ? '✏️ Edit Campus Event' : '📅 Schedule New Event'}
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
                
                {/* Event Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">Event Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. National Level Robotics Hackathon & Combat Wars 2026"
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                  />
                </div>

                {/* Sub row config parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    >
                      {['Workshops', 'Seminars', 'Events', 'Sports'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned Department */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Host Department</label>
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

                  {/* Venue location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Venue Location</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Indoor Gym / Seminar Block A"
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    />
                  </div>
                </div>

                {/* Logistics date times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Event date/time */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Event Date & Time</label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    />
                  </div>

                  {/* Reg deadline */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">Registration Deadline</label>
                    <input
                      type="datetime-local"
                      value={registrationDeadline}
                      onChange={(e) => setRegistrationDeadline(e.target.value)}
                      className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-semibold text-xs"
                    />
                  </div>
                </div>

                {/* Banner Image URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">Event Banner Image URL (Unsplash/Stock)</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-1485827404703-89b55fcc595e..."
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none text-xs"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wide">Event Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of activities, prizes, entry fees, and registration criteria here..."
                    rows={4}
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none text-xs resize-none"
                  />
                </div>

                {/* Spotlights featured check */}
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="featured_toggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-800 shrink-0"
                  />
                  <label htmlFor="featured_toggle" className="font-semibold text-slate-300 cursor-pointer select-none">
                    ⭐ Spotlight this event on the central home page carousel
                  </label>
                </div>

                {/* Save submit */}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition text-xs mt-2"
                >
                  {editingEvent ? 'Update Event Details' : 'Schedule Event'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
