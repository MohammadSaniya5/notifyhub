'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const tickerItems = [
  "🚨 Fee deadline — 25th May",
  "📢 TCS Recruitment Drive — 28th May",
  "📅 Sports Day — 1st June",
  "📚 Exam Schedule Released",
  "🎓 Convocation Ceremony — 10th June",
]

const stats = [
  { num: 24, label: 'Notices This Month', color: '#3b82f6', suffix: '+' },
  { num: 8, label: 'Upcoming Events', color: '#22c55e', suffix: '' },
  { num: 3, label: 'Urgent Alerts', color: '#f87171', suffix: '' },
  { num: 6, label: 'Departments', color: '#c084fc', suffix: '+' },
]

const features = [
  { icon: '📢', title: 'Instant Announcements', desc: 'Get every college notice the moment it is posted — no delays, no missed updates.' },
  { icon: '🚨', title: 'Urgent Alert System', desc: 'Exam deadlines, fee reminders and placement drives highlighted with priority alerts.' },
  { icon: '📅', title: 'Live Event Tracker', desc: 'All upcoming events with live countdown timers so you never miss a registration.' },
  { icon: '🔍', title: 'Smart Search & Filter', desc: 'Find any notice instantly — filter by department, category or date in seconds.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Access NotifyHub on any device — mobile, tablet or desktop seamlessly.' },
  { icon: '⚡', title: 'Real-Time Updates', desc: 'No need to reload or check WhatsApp groups — the platform updates live.' },
]

export default function Home() {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const targets = [24, 8, 3, 6]
    const current = [0, 0, 0, 0]
    const timer = setInterval(() => {
      let done = true
      const updated = current.map((c, i) => {
        if (c < targets[i]) { done = false; current[i]++; return current[i] }
        return c
      })
      setCounts([...updated])
      if (done) clearInterval(timer)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 140 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,

  r: Math.random() * 2 + 0.5,

  opacity: Math.random() * 0.5 + 0.2,

  twinkle: Math.random() * 0.01 + 0.002,

  dir: Math.random() > 0.5 ? 1 : -1,

  // smooth floating movement
  dx: (Math.random() - 0.5) * 0.15,
  dy: (Math.random() - 0.5) * 0.15,
}))

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        star.opacity += star.twinkle * star.dir
        if (star.opacity > 0.9 || star.opacity < 0.1) star.dir *= -1
        star.x += star.dx
star.y += star.dy

// soft bounce
if (star.x < 0 || star.x > canvas.width) {
  star.dx *= -1
}

if (star.y < 0 || star.y > canvas.height) {
  star.dy *= -1
}
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147,197,253,${star.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 40px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, #0f2654 0%, #070d1b 65%)',
      }}>

        {/* Stars Canvas */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          borderRadius: '50%', top: '-200px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Live Badge */}
        <div style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(37,99,235,0.08)',
          border: '1px solid rgba(37,99,235,0.2)',
          color: '#60a5fa', padding: '8px 18px',
          borderRadius: '99px', fontSize: '12px',
          fontWeight: '500', marginBottom: '32px',
          letterSpacing: '0.5px',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#22c55e', display: 'inline-block',
            boxShadow: '0 0 6px #22c55e',
          }} />
          Campus Notice Board — Live
        </div>

        {/* Heading */}
        <h1 style={{
          position: 'relative',
          fontSize: '64px', fontWeight: '800',
          lineHeight: '1.1', letterSpacing: '-2px',
          color: '#f1f5f9', marginBottom: '24px',
          maxWidth: '720px',
        }}>
          Never Miss a<br />
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Campus Update</span>
          <br />Again
        </h1>

        {/* Subheading */}
        <p style={{
          position: 'relative',
          fontSize: '17px', color: '#64748b',
          maxWidth: '480px', lineHeight: '1.8',
          marginBottom: '40px',
        }}>
          One smart platform for all college announcements, events, and urgent alerts. Say goodbye to WhatsApp chaos and physical notice boards.
        </p>

        {/* CTA */}
        <div style={{ position: 'relative', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/announcements" style={{
            padding: '14px 32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            color: '#fff', fontSize: '14px', fontWeight: '600',
            textDecoration: 'none', letterSpacing: '0.3px',
            boxShadow: '0 0 28px rgba(37,99,235,0.35)',
          }}>
            View Announcements →
          </Link>
          <Link href="/events" style={{
            padding: '14px 32px', borderRadius: '10px',
            border: '1px solid #1e3a5f', color: '#94a3b8',
            fontSize: '14px', textDecoration: 'none',
            background: 'rgba(255,255,255,0.02)',
          }}>
            Explore Events
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '28px',
          left: '50%', transform: 'translateX(-50%)',
          color: '#334155', fontSize: '12px',
        }}>
          ↓ scroll to explore
        </div>
      </section>

      {/* LIVE TICKER */}
      <div style={{
        background: '#0a1628',
        borderTop: '1px solid #1e3a5f',
        borderBottom: '1px solid #1e3a5f',
        padding: '12px 40px',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        <span style={{
          background: 'rgba(37,99,235,0.15)',
          color: '#3b82f6', fontSize: '11px',
          padding: '4px 12px', borderRadius: '99px',
          fontWeight: '700', whiteSpace: 'nowrap',
          letterSpacing: '1px',
        }}>● LIVE</span>
        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
          {tickerItems[tickerIndex]}
        </span>
      </div>

      {/* STATS */}
      <section style={{ padding: '72px 40px 48px', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textAlign: 'center', marginBottom: '12px' }}>
          BY THE NUMBERS
        </p>
        <h2 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
          Real impact, every day
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: '#0d1626',
              border: '1px solid #1e3a5f',
              borderRadius: '16px', padding: '28px 20px',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
              }} />
              <div style={{ fontSize: '42px', fontWeight: '800', color: stat.color, marginBottom: '8px', letterSpacing: '-1px' }}>
                {counts[i]}{stat.suffix}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '24px 40px 80px', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textAlign: 'center', marginBottom: '12px' }}>
          WHY NOTIFYHUB
        </p>
        <h2 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
          Everything your campus needs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i}
              style={{
                background: '#0d1626', border: '1px solid #1e3a5f',
                borderRadius: '14px', padding: '28px 24px', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        margin: '0 40px 80px', borderRadius: '20px',
        padding: '60px 40px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0f2654 0%, #1e1060 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', top: '-100px', right: '-50px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Stay ahead. Stay informed.
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
          All your college updates in one place — right now.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/announcements" style={{
            padding: '12px 28px', borderRadius: '10px',
            background: '#2563eb', color: '#fff',
            fontSize: '14px', fontWeight: '600', textDecoration: 'none',
          }}>
            Browse Notices →
          </Link>
          <Link href="/urgent" style={{
            padding: '12px 28px', borderRadius: '10px',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontSize: '14px', textDecoration: 'none',
            background: 'rgba(239,68,68,0.08)',
          }}>
            🚨 View Urgent
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1e3a5f', padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '16px',
          }}>🔔</div>
          <span style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600' }}>NotifyHub</span>
          <span style={{ color: '#334155', fontSize: '12px' }}>— Smart Campus Platform</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['Home', '/'], ['Announcements', '/announcements'], ['Events', '/events'], ['Urgent', '/urgent'], ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#475569', fontSize: '12px', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
        <p style={{ color: '#334155', fontSize: '12px' }}>© 2025 NotifyHub. All rights reserved.</p>
      </footer>

    </main>
  )
}