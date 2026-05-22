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

const categories = ['Exams', 'Placements', 'Events', 'General', 'Finance', 'Holiday']
const departments = ['All Departments', 'CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'MCA']

export default function AdminDashboard() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', category: 'General',
    department: 'All Departments', urgent: false, image: '', link: '',
  })

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin')
      return
    }
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      setAnnouncements(data)
    } catch {
      setAnnouncements([])
    }
    setLoading(false)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handlePost = async (e: React.FormEvent) => {
  e.preventDefault()

  setPosting(true)

  try {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      showToast('✅ Announcement posted successfully!')

      setForm({
        title: '',
        description: '',
        category: 'General',
        department: 'All Departments',
        urgent: false,
        image: '',
        link: '',
      })

      fetchAnnouncements()
    } else {
      showToast(`❌ ${data.error || 'Failed to post'}`)
    }
  } catch (error) {
    console.error(error)
    showToast('❌ Server error while posting!')
  }

  setPosting(false)
}

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      showToast('🗑️ Deleted!')
      fetchAnnouncements()
    } catch {
      showToast('❌ Failed to delete!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    router.push('/admin')
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

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>👨‍💼 Admin Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Manage all campus announcements</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 20px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>

        {/* Post Form */}
        <div style={{ background: '#0d1626', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '32px', marginBottom: '36px' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>📢 Post New Announcement</h2>
          <form onSubmit={handlePost}>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Description *</label>
              <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Full announcement details..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Category + Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Department *</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Image URL + Link */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Image URL (optional)</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Link (optional)</label>
                <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: '#070d1b', border: '1px solid #1e3a5f', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Urgent Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <input type="checkbox" id="urgent" checked={form.urgent} onChange={e => setForm({ ...form, urgent: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="urgent" style={{ color: '#f87171', fontSize: '13px', cursor: 'pointer' }}>
                🚨 Mark as Urgent
              </label>
            </div>

            <button type="submit" disabled={posting} style={{ width: '100%', padding: '13px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              {posting ? 'Posting...' : 'Post Announcement →'}
            </button>
          </form>
        </div>

        {/* Posted Announcements */}
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            📋 All Announcements ({announcements.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading...</div>
          ) : announcements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', background: '#0d1626', borderRadius: '12px', border: '1px solid #1e3a5f' }}>
              No announcements yet. Post your first one above! 👆
            </div>
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
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{a.description.slice(0, 100)}...</p>
                    <p style={{ color: '#475569', fontSize: '11px' }}>📅 {a.date}</p>
                  </div>
                  <button onClick={() => handleDelete(a.id)} style={{ marginLeft: '16px', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}