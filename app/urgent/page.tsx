'use client'
import { useState, useEffect } from 'react'

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

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const normalizeDate = (d: string) => {
      // handles DD-MM-YYYY
      if (d.includes('-') && d.split('-')[0].length === 2) {
        const [dd, mm, yyyy] = d.split('-')
        return new Date(`${yyyy}-${mm}-${dd}T23:59:59`)
      }

      // already ISO (YYYY-MM-DD)
      return new Date(`${d}T23:59:59`)
    }

    const calc = () => {
      const target = normalizeDate(deadline).getTime()

      if (isNaN(target)) {
        setTimeLeft('INVALID DATE')
        return
      }

      const diff = target - Date.now()

      if (diff <= 0) {
        setTimeLeft('DEADLINE PASSED')
        return
      }

      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)

      setTimeLeft(`${d}d ${h}h ${m}m remaining`)
    }
    calc()
    const t = setInterval(calc, 30000)
    return () => clearInterval(t)
  }, [deadline])

  return (
  <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '600' }}>
    🕒 Now: {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
  </span>
)
}

export default function Urgent() {
  const [urgentNotices, setUrgentNotices] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        const urgent = data.filter((a: Announcement) => a.urgent)
        setUrgentNotices(urgent)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 800)
    return () => clearInterval(t)
  }, [])

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '8px',
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>

            <span style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 0 22px rgba(239,68,68,0.35)',
            }}>
              🛡️
            </span>

            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg,#ffffff,#f87171)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
            }}>
              Urgent Alerts
            </h1>

          </div>

          <span style={{
            background: blink ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.08)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.35)',
            fontSize: '11px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontWeight: '700',
            transition: 'all 0.3s ease',
            boxShadow: blink ? '0 0 18px rgba(239,68,68,0.25)' : 'none',
          }}>
            ● LIVE MONITORING
          </span>

        </div>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '36px' }}>
          High priority notices requiring immediate attention
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px' }}>Loading alerts...</div>
        ) : urgentNotices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0d1626', borderRadius: '14px', border: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: '600' }}>No urgent alerts right now!</p>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>All clear — check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {urgentNotices.map((notice) => (
              <div key={notice.id} style={{
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '14px', padding: '28px',
                borderLeft: '4px solid #ef4444',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      background: 'rgba(239,68,68,0.15)', color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.3)',
                      fontSize: '10px', padding: '3px 10px', borderRadius: '99px', fontWeight: '700',
                    }}>URGENT</span>
                    <span style={{
                      background: 'rgba(30,58,95,0.6)', color: '#64748b',
                      fontSize: '10px', padding: '3px 10px', borderRadius: '99px',
                    }}>{notice.category}</span>
                    <span style={{
                      background: 'rgba(30,58,95,0.6)', color: '#64748b',
                      fontSize: '10px', padding: '3px 10px', borderRadius: '99px',
                    }}>{notice.department}</span>
                  </div>
                  <Countdown deadline={notice.date} />
                </div>

                <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                  {notice.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
                  {notice.description}
                </p>

                {notice.image && (
                  <img src={notice.image} alt="notice" style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', maxHeight: '200px', objectFit: 'cover' }} />
                )}

                {notice.link && (
                  <a href={notice.link} target="_blank" rel="noreferrer"
                    style={{ color: '#3b82f6', fontSize: '13px', textDecoration: 'none' }}>
                    🔗 View Details →
                  </a>
                )}

                <p style={{ color: '#475569', fontSize: '11px', marginTop: '12px' }}>📅 Posted: {notice.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}