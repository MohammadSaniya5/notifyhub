'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  setLoading(true)
  setError('')

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    if (res.ok) {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password!')
    }
  } catch {
    setError('Something went wrong!')
  }

  setLoading(false)
}

  return (
    <main style={{ background: '#070d1b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>🔔</div>
          <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Admin Login</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>NotifyHub Control Panel</p>
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

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '24px' }}>
          Students don't need login — just visit the website!
        </p>
      </div>
    </main>
  )
}