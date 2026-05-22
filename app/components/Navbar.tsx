'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/events', label: 'Events' },
  { href: '/urgent', label: 'Urgent' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{
      background: '#0a0f1e',
      borderBottom: '1px solid #1e3a5f',
      padding: '0 40px',
      height: '64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>

      {/* Logo */}
      <Link href="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}>🔔</div>
        <span style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f1f5f9',
          letterSpacing: '-0.3px',
        }}>NotifyHub</span>
        <span style={{
          fontSize: '10px',
          background: 'rgba(37,99,235,0.2)',
          color: '#60a5fa',
          border: '1px solid rgba(37,99,235,0.3)',
          padding: '2px 8px',
          borderRadius: '99px',
        }}>BETA</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={{
            fontSize: '13px',
            textDecoration: 'none',
            color: pathname === link.href ? '#60a5fa' : '#64748b',
            borderBottom: pathname === link.href ? '2px solid #60a5fa' : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'color 0.2s',
          }}>
            {link.label}
          </Link>
        ))}

        <Link href="/urgent" style={{
          fontSize: '12px',
          padding: '8px 16px',
          borderRadius: '8px',
          background: 'rgba(239,68,68,0.12)',
          color: '#f87171',
          border: '1px solid rgba(239,68,68,0.25)',
          textDecoration: 'none',
          fontWeight: '500',
        }}>
          🚨 Urgent
        </Link>
      </div>

    </nav>
  )
}