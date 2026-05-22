'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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

const categories = ["All", "Exams", "Placements", "Events", "General", "Finance", "Holiday"]

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selected, setSelected] = useState("All")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => { setAnnouncements(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = announcements.filter((a) => {
    const matchCategory = selected === "All" || a.category === selected
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
  <h1 style={{
    fontSize: '36px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    letterSpacing: '-1px',
  }}>
    
    <span style={{
      fontSize: '30px',
      filter: 'drop-shadow(0 0 10px rgba(96,165,250,0.35))',
    }}>
      🏛️
    </span>

    <span style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      Announcements
    </span>

  </h1>

  <p style={{
    color: '#64748b',
    fontSize: '14px',
    marginLeft: '44px',
  }}>
    All college notices in one place — updated live by admin
  </p>
</div>

        <input type="text" placeholder="🔍 Search announcements..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#0d1626', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)} style={{
              padding: '6px 16px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer',
              border: `1px solid ${selected === cat ? '#2563eb' : '#1e3a5f'}`,
              background: selected === cat ? '#2563eb' : '#0d1626',
              color: selected === cat ? '#fff' : '#64748b',
            }}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px' }}>Loading announcements...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#475569', padding: '60px' }}>No announcements found!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((a) => (
              <div key={a.id} onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                style={{ background: '#0d1626', borderRadius: '12px', padding: '20px 24px', cursor: 'pointer', border: `1px solid ${expanded === a.id ? '#2563eb' : '#1e3a5f'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {a.urgent && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', fontSize: '10px', padding: '2px 8px', borderRadius: '99px', fontWeight: '600' }}>URGENT</span>}
                      <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{a.category}</span>
                      <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{a.department}</span>
                    </div>
                    <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{a.title}</p>
                    <p style={{ color: '#475569', fontSize: '11px' }}>📅 {a.date}</p>
                  </div>
                  <span style={{ color: '#2563eb', fontSize: '14px', marginLeft: '16px' }}>{expanded === a.id ? '▲' : '▼'}</span>
                </div>
                {expanded === a.id && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e3a5f' }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', marginBottom: '12px' }}>{a.description}</p>
                    {a.image && <Image
  src={a.image}
  alt="announcement"
  width={800}
  height={400}
  style={{
    width: '100%',
    borderRadius: '8px',
    marginBottom: '12px',
    maxHeight: '300px',
    objectFit: 'cover',
  }}
/>}
                    {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: '13px' }}>🔗 View Link →</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}