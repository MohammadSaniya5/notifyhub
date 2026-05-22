'use client'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', department: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const departments = ['CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'MCA', 'Other']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>📬 Contact Us</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Have a query? Reach out and we will get back to you.</p>
        </div>

        {submitted ? (
          <div style={{
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '14px', padding: '40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#4ade80', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Query Submitted!</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>We will get back to you within 24 hours.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', department: '', message: '' }) }}
              style={{ marginTop: '24px', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              Submit Another
            </button>
          </div>
        ) : (
          <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '14px', padding: '36px' }}>
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Department */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Department *</label>
                <select
                  required
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: form.department ? '#f1f5f9' : '#475569', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Message * <span style={{ color: '#475569', float: 'right' }}>{form.message.length}/500</span>
                </label>
                <textarea
                  required
                  maxLength={500}
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your query here..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '14px', background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
              }}>
                Send Message →
              </button>
            </form>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>❓ FAQs</h2>
          {[
            { q: 'How do I get notified about urgent alerts?', a: 'Visit the Urgent Alerts page regularly or bookmark it. All high priority notices appear there instantly.' },
            { q: 'Who can post announcements?', a: 'Only authorized college admin staff can post announcements on NotifyHub.' },
            { q: 'How often is the notice board updated?', a: 'NotifyHub is updated in real-time. As soon as admin posts a notice, it appears on the platform immediately.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '20px 24px', marginBottom: '10px' }}>
              <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: {faq.q}</p>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>A: {faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}