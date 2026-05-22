'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  description: string
  category: string
  department: string
  date: string
  urgent: boolean
  image?: string
  link?: string
}

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
}

const announcementCategories = ['Exams', 'Placements', 'Events', 'General', 'Finance', 'Holiday']
const eventCategories = ['Placements', 'Sports', 'Workshop', 'Ceremony', 'Fest', 'Social', 'General']
const departments = ['All Departments', 'CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'MCA']

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'announcements' | 'events' | 'queries'>('announcements')
const [queries, setQueries] = useState<any[]>([])
const [answerText, setAnswerText] = useState<Record<string, string>>({})
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [toast, setToast] = useState('')

  const [aForm, setAForm] = useState({
    title: '', description: '', category: 'General',
    department: 'All Departments', urgent: false, image: '', link: '',
  })

  const [eForm, setEForm] = useState({
    title: '', description: '', category: 'General',
    department: 'All Departments', date: '', time: '', venue: '', registrationLink: '',
  })

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
  try {
    const [aRes, eRes, qRes] = await Promise.all([
      fetch('/api/announcements'),
      fetch('/api/events'),
      fetch('/api/queries'),
    ])
    const [aData, eData, qData] = await Promise.all([aRes.json(), eRes.json(), qRes.json()])
    setAnnouncements(aData)
    setEvents(eData)
    setQueries(qData)
  } catch {}
  setLoading(false)
}

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aForm),
      })
      if (res.ok) {
        showToast('✅ Announcement posted!')
        setAForm({ title: '', description: '', category: 'General', department: 'All Departments', urgent: false, image: '', link: '' })
        fetchAll()
      }
    } catch { showToast('❌ Failed!') }
    setPosting(false)
  }

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eForm),
      })
      if (res.ok) {
        showToast('✅ Event posted!')
        setEForm({ title: '', description: '', category: 'General', department: 'All Departments', date: '', time: '', venue: '', registrationLink: '' })
        fetchAll()
      }
    } catch { showToast('❌ Failed!') }
    setPosting(false)
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
    showToast('🗑️ Deleted!')
    fetchAll()
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    showToast('🗑️ Deleted!')
    fetchAll()
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    background: '#070d1b', border: '1px solid #1e3a5f',
    color: '#f1f5f9', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    color: '#94a3b8', fontSize: '13px',
    display: 'block', marginBottom: '8px',
  }

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '40px' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', background: '#0d1626', border: '1px solid #1e3a5f', color: '#f1f5f9', padding: '12px 20px', borderRadius: '10px', fontSize: '13px', zIndex: 999 }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Modern Admin Header */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '36px',
  flexWrap: 'wrap',
  gap: '16px',
}}>

  {/* Left Section */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

    {/* Icon / Brand Block (no emoji style) */}
    <div style={{
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '800',
      color: '#bfdbfe',
      letterSpacing: '1px',
      boxShadow: '0 0 24px rgba(37,99,235,0.3)',
    }}>
      NH
    </div>

    {/* Title + Subtitle */}
    <div>
      <h1 style={{
        color: '#f1f5f9',
        fontSize: '28px',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '-0.5px',
      }}>
        Admin Console
      </h1>

      <p style={{
        color: '#64748b',
        fontSize: '13px',
        marginTop: '4px',
      }}>
        Manage announcements, events & student queries
      </p>
    </div>

  </div>

  {/* Right Side Controls */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

    {/* Status badge */}
    <span style={{
      background: 'rgba(37,99,235,0.12)',
      color: '#60a5fa',
      border: '1px solid rgba(37,99,235,0.35)',
      fontSize: '11px',
      padding: '6px 14px',
      borderRadius: '999px',
      fontWeight: '700',
      boxShadow: '0 0 14px rgba(37,99,235,0.15)',
    }}>
      ⚡ LIVE SYSTEM
    </span>

    {/* Logout Button */}
    <button
      onClick={() => {
        localStorage.removeItem('admin_auth')
        router.push('/admin')
      }}
      style={{
        padding: '8px 18px',
        background: 'rgba(239,68,68,0.08)',
        color: '#f87171',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
      }}
    >
      Logout
    </button>

  </div>

</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {(['announcements', 'events', 'queries'] as const).map(t => (
  <button key={t} onClick={() => setTab(t)} style={{
    padding: '10px 24px', borderRadius: '8px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer',
    border: tab === t ? 'none' : '1px solid #1e3a5f',
    background: tab === t ? '#2563eb' : '#0d1626',
    color: tab === t ? '#fff' : '#64748b',
  }}>
    {t === 'announcements' ? '📢 Announcements' : t === 'events' ? '📅 Events' : '💬 Queries'}
  </button>
))}
        </div>

        {/* ANNOUNCEMENTS TAB */}
        {tab === 'announcements' && (
          <>
            <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '32px', marginBottom: '36px' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>📢 Post Announcement</h2>
              <form onSubmit={handlePostAnnouncement}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Title *</label>
                  <input required value={aForm.title} onChange={e => setAForm({ ...aForm, title: e.target.value })} placeholder="Announcement title..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea required rows={4} value={aForm.description} onChange={e => setAForm({ ...aForm, description: e.target.value })} placeholder="Full details..." style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select value={aForm.category} onChange={e => setAForm({ ...aForm, category: e.target.value })} style={inputStyle}>
                      {announcementCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Department *</label>
                    <select value={aForm.department} onChange={e => setAForm({ ...aForm, department: e.target.value })} style={inputStyle}>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Image URL (optional)</label>
                    <input value={aForm.image} onChange={e => setAForm({ ...aForm, image: e.target.value })} placeholder="https://..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Link (optional)</label>
                    <input value={aForm.link} onChange={e => setAForm({ ...aForm, link: e.target.value })} placeholder="https://..." style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <input type="checkbox" id="urgent" checked={aForm.urgent} onChange={e => setAForm({ ...aForm, urgent: e.target.checked })} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <label htmlFor="urgent" style={{ color: '#f87171', fontSize: '13px', cursor: 'pointer' }}>🚨 Mark as Urgent</label>
                </div>
                <button type="submit" disabled={posting} style={{ width: '100%', padding: '13px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  {posting ? 'Posting...' : 'Post Announcement →'}
                </button>
              </form>
            </div>

            {/* List */}
            <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              📋 All Announcements ({announcements.length})
            </h2>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading...</div>
            ) : announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', background: '#0d1626', borderRadius: '12px', border: '1px solid #1e3a5f' }}>No announcements yet!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {announcements.map((a) => (
                  <div key={a.id} style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        {a.urgent && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', fontSize: '10px', padding: '2px 8px', borderRadius: '99px', fontWeight: '600' }}>URGENT</span>}
                        <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{a.category}</span>
                        <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{a.department}</span>
                      </div>
                      <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{a.title}</p>
                      <p style={{ color: '#475569', fontSize: '11px' }}>📅 {a.date}</p>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(a.id)} style={{ marginLeft: '16px', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* EVENTS TAB */}
        {tab === 'events' && (
          <>
            <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '32px', marginBottom: '36px' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>📅 Post Event</h2>
              <form onSubmit={handlePostEvent}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Title *</label>
                  <input required value={eForm.title} onChange={e => setEForm({ ...eForm, title: e.target.value })} placeholder="Event title..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea required rows={4} value={eForm.description} onChange={e => setEForm({ ...eForm, description: e.target.value })} placeholder="Event details..." style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select value={eForm.category} onChange={e => setEForm({ ...eForm, category: e.target.value })} style={inputStyle}>
                      {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Department *</label>
                    <select value={eForm.department} onChange={e => setEForm({ ...eForm, department: e.target.value })} style={inputStyle}>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Date *</label>
                    <input required type="date" value={eForm.date} onChange={e => setEForm({ ...eForm, date: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Time *</label>
                    <input required type="time" value={eForm.time} onChange={e => setEForm({ ...eForm, time: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Venue *</label>
                    <input required value={eForm.venue} onChange={e => setEForm({ ...eForm, venue: e.target.value })} placeholder="Main Auditorium..." style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Registration Link (optional)</label>
                  <input value={eForm.registrationLink} onChange={e => setEForm({ ...eForm, registrationLink: e.target.value })} placeholder="https://..." style={inputStyle} />
                </div>
                <button type="submit" disabled={posting} style={{ width: '100%', padding: '13px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  {posting ? 'Posting...' : 'Post Event →'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              📋 All Events ({events.length})
            </h2>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading...</div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', background: '#0d1626', borderRadius: '12px', border: '1px solid #1e3a5f' }}>No events yet!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {events.map((ev) => (
                  <div key={ev.id} style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{ev.category}</span>
                        <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{ev.department}</span>
                      </div>
                      <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{ev.title}</p>
                      <p style={{ color: '#475569', fontSize: '11px' }}>📅 {ev.date} 🕐 {ev.time} 📍 {ev.venue}</p>
                    </div>
                    <button onClick={() => handleDeleteEvent(ev.id)} style={{ marginLeft: '16px', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* QUERIES TAB */}
{tab === 'queries' && (
  <div>
    <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
      💬 Student Queries ({queries.length})
    </h2>
    {queries.length === 0 ? (
      <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', background: '#0d1626', borderRadius: '12px', border: '1px solid #1e3a5f' }}>No queries yet!</div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {queries.map((q: any) => (
          <div key={q.id} style={{ background: '#0d1626', border: `1px solid ${q.answered ? 'rgba(34,197,94,0.3)' : '#1e3a5f'}`, borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{q.department}</span>
              <span style={{ color: '#475569', fontSize: '11px' }}>{q.name} — {q.email}</span>
              {q.answered && <span style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>Answered</span>}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>Q: {q.message}</p>

            {q.answered ? (
              <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '12px 16px' }}>
                <p style={{ color: '#60a5fa', fontSize: '13px' }}>A: {q.answer}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={answerText[q.id] || ''}
                  onChange={e => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                  placeholder="Type your answer..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}
                />
                <button onClick={async () => {
                  if (!answerText[q.id]) return
                  await fetch(`/api/queries/${q.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answer: answerText[q.id] }),
                  })
                  showToast('✅ Answer posted!')
                  fetchAll()
                }} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Answer →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}
      </div>
    </main>
  )
}