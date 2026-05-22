'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (username === 'admin' && password === 'notifyhub123') {
        localStorage.setItem('admin_auth', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid username or password!')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Modern Header */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '40px',
  gap: '16px',
}}>

  {/* Left */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  }}>

    {/* Icon Box (NO emoji style) */}
    <div style={{
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 22px rgba(37,99,235,0.35)',
      fontSize: '18px',
      fontWeight: '700',
      color: '#bfdbfe',
      letterSpacing: '1px',
    }}>
      NH
    </div>

    {/* Title */}
    <div>
      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        margin: 0,
        color: '#f1f5f9',
        letterSpacing: '-0.5px',
      }}>
        Admin Panel
      </h1>

      <p style={{
        color: '#64748b',
        fontSize: '13px',
        marginTop: '4px',
      }}>
        NotifyHub Control Center
      </p>
    </div>

  </div>

  {/* Status Badge */}
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
    🔐 SECURE LOGIN
  </span>

</div>

        {/* Form */}
        <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '36px' }}>
          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Username</label>
              <input
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'Logging in...' : 'Login to Dashboard →'}
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#8490a1', fontSize: '12px', marginTop: '24px' }}>
          Students don't need login — just visit the website!
        </p>
      </div>
    </main>
  )
}