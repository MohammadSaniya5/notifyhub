'use client'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  description: string
  category: string
  department: string
  date: string
  time: string
  venue: string
  registrationLink?: string
  createdAt: number
}

const categories = ["All", "Placements", "Sports", "Workshop", "Ceremony", "Fest", "Social"]

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  Placements: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  Sports: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  Workshop: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  Ceremony: { bg: 'rgba(234,179,8,0.12)', color: '#facc15', border: 'rgba(234,179,8,0.25)' },
  Fest: { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  Social: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  General: { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.25)' },
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
  const [events, setEvents] = useState<Event[]>([])
  const [selected, setSelected] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date().getTime()

  const upcoming = events.filter(e => new Date(e.date).getTime() >= now)
  const past = events.filter(e => new Date(e.date).getTime() < now)

  const filtered = (tab: Event[]) =>
    tab.filter(e => selected === "All" || e.category === selected)

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

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
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

        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#475569', padding: '60px', background: '#0d1626', borderRadius: '12px', border: '1px solid #1e3a5f' }}>
            No events posted yet!
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            {filtered(upcoming).length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  🔜 Upcoming Events
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filtered(upcoming).map((event) => {
                    const colors = categoryColors[event.category] || categoryColors.General
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
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                              <span style={{
                                background: colors.bg, color: colors.color,
                                border: `1px solid ${colors.border}`,
                                fontSize: '11px', padding: '3px 10px',
                                borderRadius: '99px', fontWeight: '500',
                              }}>{event.category}</span>
                              <Countdown dateStr={event.date} />
                            </div>
                            <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                              {event.title}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                              {event.description}
                            </p>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <span style={{ color: '#475569', fontSize: '12px' }}>📅 {event.date}</span>
                              <span style={{ color: '#475569', fontSize: '12px' }}>🕐 {event.time}</span>
                              <span style={{ color: '#475569', fontSize: '12px' }}>📍 {event.venue}</span>
                              <span style={{ color: '#475569', fontSize: '12px' }}>🏫 {event.department}</span>
                            </div>
                          </div>

                          {event.registrationLink && (
                            <a href={event.registrationLink} target="_blank" rel="noreferrer" style={{
                              marginLeft: '24px', padding: '10px 20px',
                              background: '#2563eb', color: '#fff',
                              border: 'none', borderRadius: '8px',
                              fontSize: '12px', fontWeight: '500',
                              textDecoration: 'none', whiteSpace: 'nowrap',
                            }}>
                              Register →
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Past Events */}
            {filtered(past).length > 0 && (
              <div>
                <h2 style={{ color: '#64748b', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  📁 Past Events
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filtered(past).map((event) => {
                    const colors = categoryColors[event.category] || categoryColors.General
                    return (
                      <div key={event.id} style={{
                        background: '#0a0f1a', border: '1px solid #1e3a5f',
                        borderRadius: '14px', padding: '24px', opacity: 0.7,
                      }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{
                            background: colors.bg, color: colors.color,
                            border: `1px solid ${colors.border}`,
                            fontSize: '11px', padding: '3px 10px',
                            borderRadius: '99px', fontWeight: '500',
                          }}>{event.category}</span>
                          <span style={{ color: '#475569', fontSize: '11px' }}>Completed</span>
                        </div>
                        <h3 style={{ color: '#64748b', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                          {event.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#334155', fontSize: '12px' }}>📅 {event.date}</span>
                          <span style={{ color: '#334155', fontSize: '12px' }}>📍 {event.venue}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}