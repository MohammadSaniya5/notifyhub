'use client'
import { useState, useEffect } from 'react'

interface Query {
  id: string
  name: string
  email: string
  department: string
  message: string
  answer?: string
  answered: boolean
  createdAt: number
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', department: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [posting, setPosting] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'MCA', 'Other']

  useEffect(() => {
    fetch('/api/queries')
      .then(res => res.json())
      .then(data => setQueries(data.filter((q: Query) => q.answered)))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSubmitted(true)
    } catch {}
    setPosting(false)
  }

  const faqs = [
    { q: 'How do I get notified about urgent alerts?', a: 'Visit the Urgent Alerts page regularly or bookmark it. All high priority notices appear there instantly.' },
    { q: 'Who can post announcements?', a: 'Only authorized college admin staff can post announcements on NotifyHub.' },
    { q: 'How often is the notice board updated?', a: 'NotifyHub is updated in real-time. As soon as admin posts a notice, it appears on the platform immediately.' },
  ]

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    background: '#070d1b', border: '1px solid #1e3a5f',
    color: '#f1f5f9', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Fancy Header */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '36px',
}}>

  {/* Left Side */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  }}>

    {/* Icon Box */}
    <span style={{
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      boxShadow: '0 0 22px rgba(37,99,235,0.35)',
    }}>
      ✉️
    </span>

    {/* Title */}
    <div>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '700',
        margin: 0,
        background: 'linear-gradient(135deg,#ffffff,#60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-1px',
      }}>
        Contact Hub
      </h1>

      <p style={{
        color: '#64748b',
        fontSize: '14px',
        marginTop: '4px',
      }}>
        Have a query? Reach out and we’ll respond within 24 hours.
      </p>
    </div>

  </div>

  {/* Right Badge */}
  <span style={{
    background: 'rgba(37,99,235,0.12)',
    color: '#60a5fa',
    border: '1px solid rgba(37,99,235,0.35)',
    fontSize: '11px',
    padding: '6px 14px',
    borderRadius: '999px',
    fontWeight: '700',
    boxShadow: '0 0 16px rgba(37,99,235,0.2)',
  }}>
    💬 SUPPORT ACTIVE
  </span>

</div>

        {/* Form */}
        {submitted ? (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#4ade80', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Query Submitted!</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>We will get back to you within 24 hours.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', department: '', message: '' }) }}
              style={{ marginTop: '24px', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              Submit Another
            </button>
          </div>
        ) : (
          <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '14px', padding: '36px', marginBottom: '48px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Department *</label>
                <select required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ ...inputStyle, color: form.department ? '#f1f5f9' : '#475569' }}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Message * <span style={{ color: '#475569', float: 'right' }}>{form.message.length}/500</span>
                </label>
                <textarea required maxLength={500} rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your query here..." style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button type="submit" disabled={posting} style={{ width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {posting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        )}

        {/* Answered Queries */}
        {queries.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              💬 Student Queries & Answers
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {queries.map((q) => (
                <div key={q.id} style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(30,58,95,0.6)', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '99px' }}>{q.department}</span>
                    <span style={{ color: '#475569', fontSize: '11px' }}>{q.name}</span>
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>
                    Q: {q.message}
                  </p>
                  <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '12px 16px' }}>
                    <p style={{ color: '#60a5fa', fontSize: '13px', lineHeight: '1.6' }}>
                      A: {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>❓ FAQs</h2>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '20px 24px', marginBottom: '10px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>{faq.q}</p>
                <span style={{ color: '#2563eb', fontSize: '14px' }}>{openFaq === i ? '▲' : '▼'}</span>
              </div>
              {openFaq === i && (
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e3a5f' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}