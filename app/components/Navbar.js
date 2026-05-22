'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/events', label: 'Events' },
  { href: '/urgent', label: 'Urgent' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      background: '#0a0f1e',
      borderBottom: '1px solid #1e3a5f',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', textDecoration: 'none',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>🔔</div>
          <span style={{
  fontSize: '22px',
  fontWeight: '700',
  position: 'relative',
  color: '#f8fafc',
  letterSpacing: '0.5px',
  background: 'linear-gradient(120deg, #f8fafc 0%, #60a5fa 35%, #ffffff 50%, #60a5fa 65%, #f8fafc 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'shine 4s linear infinite',
}}>
  NotifyHub
</span>
           
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
          className="desktop-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{
              fontSize: '13px', textDecoration: 'none',
              color: pathname === link.href ? '#60a5fa' : '#64748b',
              borderBottom: pathname === link.href ? '2px solid #60a5fa' : '2px solid transparent',
              paddingBottom: '2px',
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/urgent" style={{
            fontSize: '12px', padding: '8px 16px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.12)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.25)', textDecoration: 'none',
          }}>
            🚨 Urgent
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{
            display: 'none', background: 'none',
            border: 'none', color: '#64748b',
            fontSize: '24px', cursor: 'pointer',
          }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #1e3a5f',
          padding: '16px 0',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '14px', textDecoration: 'none',
                color: pathname === link.href ? '#60a5fa' : '#94a3b8',
                padding: '10px 16px', borderRadius: '8px',
                background: pathname === link.href ? 'rgba(37,99,235,0.08)' : 'transparent',
              }}>
              {link.label}
            </Link>
          ))}
          <Link href="/urgent" onClick={() => setMenuOpen(false)} style={{
            fontSize: '14px', padding: '10px 16px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            textDecoration: 'none', marginTop: '8px',
          }}>
            🚨 Urgent Alerts
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          nav { padding: 0 16px !important; }
        }
          @keyframes shine {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}
      `}</style>
    </nav>
  )
}