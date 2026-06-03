import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen, Bell, User, LogOut, Menu, X, PlusCircle,
  LayoutDashboard, FileQuestion, Shield, ChevronDown
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getInitials } from '../lib/constants'

export default function Navbar() {
  const { user, profile, signOut, isStudent, isTeacher } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/my-doubts', label: 'My Doubts', icon: FileQuestion },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ]

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/moderation', label: 'Moderation', icon: Shield },
  ]

  const links = isStudent ? studentLinks : isTeacher ? teacherLinks : []

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to={user ? (isStudent ? '/student/dashboard' : '/teacher/dashboard') : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BookOpen size={20} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1D23' }}>
              Doubt<span style={{ color: '#6B7CC4' }}>Exchange</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
              {links.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: location.pathname === to ? '#6B7CC4' : '#6B7280',
                  background: location.pathname === to ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                {isStudent && (
                  <Link to="/student/ask" className="btn btn-primary hidden-mobile" style={{ padding: '8px 16px', gap: 6, textDecoration: 'none', fontSize: '0.875rem' }}>
                    <PlusCircle size={16} />
                    Ask Doubt
                  </Link>
                )}

                {/* User dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px', borderRadius: 8,
                      border: '1px solid #E5E7EB', background: 'white',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'white'
                    }}>
                      {getInitials(profile?.name || user?.email)}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile?.name || 'User'}
                    </span>
                    <ChevronDown size={14} color="#9CA3AF" />
                  </button>

                  {dropdownOpen && (
                    <div
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        background: 'white', border: '1px solid #E5E7EB',
                        borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        minWidth: 180, zIndex: 100, overflow: 'hidden',
                      }}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#9CA3AF' }}>Signed in as</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1A1D23' }}>{profile?.name}</p>
                        <span style={{
                          display: 'inline-block', marginTop: 4, padding: '2px 8px',
                          borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
                          background: isTeacher ? '#ECFDF5' : '#EEF2FF',
                          color: isTeacher ? '#065F46' : '#4338CA',
                          textTransform: 'capitalize'
                        }}>
                          {profile?.role}
                        </span>
                      </div>
                      <Link
                        to={isStudent ? '/student/profile' : '/teacher/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', textDecoration: 'none', color: '#374151', fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={15} /> Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu toggle */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && user && (
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
                color: location.pathname === to ? '#6B7CC4' : '#374151',
                background: location.pathname === to ? '#EEF2FF' : 'transparent',
              }}>
                <Icon size={18} /> {label}
              </Link>
            ))}
            {isStudent && (
              <Link to="/student/ask" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>
                <PlusCircle size={16} /> Ask Doubt
              </Link>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 639px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  )
}
