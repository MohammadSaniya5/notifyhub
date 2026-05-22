'use client'
import { useState, useEffect } from 'react'

const urgentNotices = [
  { id: 1, title: "End Semester Exams Schedule Released", category: "Exams", date: "20 May 2025", deadline: "2025-06-08", description: "End semester examinations commence from June 8th. Hall tickets will be distributed from 22nd May. Students must clear all dues before collecting hall tickets." },
  { id: 2, title: "Campus Recruitment Drive - TCS & Infosys", category: "Placements", date: "19 May 2025", deadline: "2025-05-28", description: "TCS and Infosys recruitment drive on 28th May. Final year eligible students must register at placement office before 22nd May without fail." },
  { id: 3, title: "Fee Payment Last Date - 25th May", category: "Finance", date: "16 May 2025", deadline: "2025-05-25", description: "Students who have not paid semester fees must pay before 25th May. Late fee of Rs.500 per day will be charged after deadline. No extensions will be granted." },
]

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft('DEADLINE PASSED'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${d}d ${h}h ${m}m remaining`)
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [deadline])

  return <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '600' }}>⏳ {timeLeft}</span>
}

export default function Urgent() {
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 800)
    return () => clearInterval(t)
  }, [])

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#f87171' }}>🚨 Urgent Alerts</h1>
              <span style={{
                background: blink ? 'rgba(239,68,68,0.2)' : 'transparent',
                color: '#f87171', border: '1px solid rgba(239,68,68,0.4)',
                fontSize: '10px', padding: '3px 10px', borderRadius: '99px',
                fontWeight: '700', transition: 'background 0.3s',
              }}>● LIVE</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>High priority notices requiring immediate attention</p>
          </div>
        </div>

        {/* Urgent Cards */}
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
                </div>
                <Countdown deadline={notice.deadline} />
              </div>
              <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                {notice.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
                {notice.description}
              </p>
              <p style={{ color: '#475569', fontSize: '11px' }}>📅 Posted: {notice.date}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}