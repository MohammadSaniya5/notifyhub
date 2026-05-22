'use client'
import { useState, useEffect } from 'react'

interface Event {
  id: number
  title: string
  category: string
  date: string
  time: string
  venue: string
  department: string
  description: string
  upcoming: boolean
}

interface Colors {
  bg: string
  color: string
  border: string
}

const events: Event[] = [
  { id: 1, title: "Campus Recruitment Drive — TCS & Infosys", category: "Placements", date: "2025-05-28", time: "9:00 AM", venue: "Main Auditorium", department: "CSE & IT", description: "TCS and Infosys will be conducting a mega recruitment drive for final year students. Bring your resume and all original certificates.", upcoming: true },
  { id: 2, title: "Annual Sports Day", category: "Sports", date: "2025-06-01", time: "8:00 AM", venue: "College Ground", department: "All Departments", description: "Annual Sports Day with cricket, volleyball, athletics and more. Register at the sports office before 28th May.", upcoming: true },
  { id: 3, title: "AI & Machine Learning Workshop", category: "Workshop", date: "2025-05-22", time: "10:00 AM", venue: "Seminar Hall B", department: "CSE", description: "A two day hands-on workshop covering fundamentals of AI and ML with Python. Certificate provided on completion.", upcoming: true },
  { id: 4, title: "Convocation Ceremony 2025", category: "Ceremony", date: "2025-06-10", time: "11:00 AM", venue: "Main Auditorium", department: "All Departments", description: "Annual convocation ceremony for graduating batch of 2025. Parents are welcome to attend.", upcoming: true },
  { id: 5, title: "Tech Fest — InnovatEx", category: "Fest", date: "2025-04-15", time: "9:00 AM", venue: "College Campus", department: "All Departments", description: "Annual tech fest with coding competitions, hackathons and project exhibitions.", upcoming: false },
  { id: 6, title: "Blood Donation Camp", category: "Social", date: "2025-04-20", time: "9:00 AM", venue: "College Lobby", department: "All Departments", description: "Voluntary blood donation camp organized in association with Red Cross Society.", upcoming: false },
]

const categories: string[] = ["All", "Placements", "Sports", "Workshop", "Ceremony", "Fest", "Social"]

const categoryColors: Record<string, Colors> = {
  Placements: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  Sports: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  Workshop: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  Ceremony: { bg: 'rgba(234,179,8,0.12)', color: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Fest: { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  Social: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
}

function Countdown({ dateStr }: { dateStr: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dateStr).getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft('Event Started'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${d}d ${h}h ${m}m`)
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [dateStr])

  return (
    <span style={{ color: '#facc15', fontSize: '11px', fontWeight: '600' }}>
      ⏳ {timeLeft}
    </span>
  )
}

export default function Events() {
  const [selected, setSelected] = useState("All")
  const [tab, setTab] = useState("upcoming")

  const filtered = events.filter((e) => {
    const matchCat = selected === "All" || e.category === selected
    const matchTab = tab === "upcoming" ? e.upcoming : !e.upcoming
    return matchCat && matchTab
  })

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
            📅 Events
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            All college events, drives and ceremonies in one place
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['upcoming', 'past'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer',
              border: tab === t ? 'none' : '1px solid #1e3a5f',
              background: tab === t ? '#2563eb' : '#0d1626',
              color: tab === t ? '#fff' : '#64748b',
            }}>
              {t === 'upcoming' ? '🔜 Upcoming' : '📁 Past Events'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)} style={{
              padding: '6px 16px', borderRadius: '99px', fontSize: '12px',
              cursor: 'pointer',
              border: `1px solid ${selected === cat ? '#2563eb' : '#1e3a5f'}`,
              background: selected === cat ? '#2563eb' : '#0d1626',
              color: selected === cat ? '#fff' : '#64748b',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            No events found!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((event) => {
              const colors = categoryColors[event.category] || categoryColors.Workshop
              return (
                <div key={event.id}
                  style={{
                    background: '#0d1626', border: '1px solid #1e3a5f',
                    borderRadius: '14px', padding: '24px', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563eb')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{
                          background: colors.bg, color: colors.color,
                          border: `1px solid ${colors.border}`,
                          fontSize: '11px', padding: '3px 10px',
                          borderRadius: '99px', fontWeight: '500',
                        }}>{event.category}</span>
                        {event.upcoming && <Countdown dateStr={event.date} />}
                      </div>

                      {/* Title */}
                      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                        {event.description}
                      </p>

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#475569', fontSize: '12px' }}>📅 {event.date}</span>
                        <span style={{ color: '#475569', fontSize: '12px' }}>🕐 {event.time}</span>
                        <span style={{ color: '#475569', fontSize: '12px' }}>📍 {event.venue}</span>
                        <span style={{ color: '#475569', fontSize: '12px' }}>🏫 {event.department}</span>
                      </div>
                    </div>

                    {/* Register Button */}
                    {event.upcoming && (
                      <button style={{
                        marginLeft: '24px', padding: '10px 20px',
                        background: '#2563eb', color: '#fff',
                        border: 'none', borderRadius: '8px',
                        fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                      }}>
                        Register →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}