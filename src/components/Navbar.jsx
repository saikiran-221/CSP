import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, User, LogOut, Menu, X, PlusCircle, LayoutDashboard, FileQuestion, Shield, ChevronDown, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Logo } from './Logo'
import { getInitials } from '../lib/constants'

export default function Navbar() {
  const { user, profile, signOut, isStudent, isTeacher } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    setDropdownOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate('/')
  }

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/my-doubts',  label: 'My Doubts', icon: FileQuestion },
    { to: '/student/notifications', label: 'Alerts', icon: Bell },
  ]
  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/moderation', label: 'Moderation', icon: Shield },
  ]
  const links = isStudent ? studentLinks : isTeacher ? teacherLinks : []
  const homePath = isTeacher ? '/teacher/dashboard' : '/student/dashboard'

  return (
    <>
      <nav style={{
        background: 'var(--c-nav-blur)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--c-border)',
        position: 'sticky', top: 0, zIndex: 50,
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

            {/* Logo */}
            <Link to={user ? homePath : '/'} style={{ textDecoration: 'none' }}>
              <Logo size="md" showText={true} />
            </Link>

            {/* Desktop nav links */}
            {user && (
              <div className="nav-hide-mobile" style={{ alignItems: 'center', gap: 2 }}>
                {links.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to
                  return (
                    <Link key={to} to={to} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 13px', borderRadius: 8, textDecoration: 'none',
                      fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s',
                      color: active ? 'var(--c-accent)' : 'var(--c-text-2)',
                      background: active ? 'var(--c-accent-bg)' : 'transparent',
                    }}>
                      <Icon size={15} /> {label}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Theme toggle */}
              <button onClick={toggleTheme} className="theme-toggle" title={isDark ? 'Switch to light' : 'Switch to dark'}>
                {isDark
                  ? <Sun size={17} color="var(--c-warning)" />
                  : <Moon size={17} color="var(--c-accent)" />}
              </button>

              {user ? (
                <>
                  {/* Ask Doubt CTA */}
                  {isStudent && (
                    <Link to="/student/ask" className="btn btn-primary nav-hide-mobile" style={{ textDecoration: 'none', padding: '7px 14px', fontSize: '0.82rem', gap: 5 }}>
                      <PlusCircle size={14} /> Ask Doubt
                    </Link>
                  )}

                  {/* User dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setDropdownOpen(o => !o)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px',
                        borderRadius: 9, border: '1px solid var(--c-border)',
                        background: 'var(--c-surface-2)', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--c-accent), var(--c-sage))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {getInitials(profile?.name || user?.email)}
                      </div>
                      <span className="nav-hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--c-text-1)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {profile?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown size={13} color="var(--c-text-3)" />
                    </button>

                    {dropdownOpen && (
                      <>
                        {/* Backdrop */}
                        <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                        <div style={{
                          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 99,
                          background: 'var(--c-surface)', border: '1px solid var(--c-border)',
                          borderRadius: 12, boxShadow: 'var(--shadow-soft)', minWidth: 200, overflow: 'hidden',
                          animation: 'slideUp 0.15s ease-out',
                        }}>
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border-2)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--c-text-3)' }}>Signed in as</p>
                            <p style={{ margin: '2px 0 4px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{profile?.name}</p>
                            <span style={{
                              padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
                              background: isTeacher ? 'var(--c-success-bg)' : 'var(--c-accent-bg)',
                              color: isTeacher ? 'var(--c-success)' : 'var(--c-accent)',
                              textTransform: 'capitalize',
                            }}>
                              {profile?.role}
                            </span>
                          </div>
                          {[
                            { label: 'Profile', icon: User, to: isStudent ? '/student/profile' : '/teacher/dashboard' },
                          ].map(item => (
                            <Link key={item.label} to={item.to} onClick={() => setDropdownOpen(false)} style={{
                              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                              textDecoration: 'none', color: 'var(--c-text-2)', fontSize: '0.875rem', transition: 'all 0.15s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-surface-2)'; e.currentTarget.style.color = 'var(--c-text-1)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text-2)' }}
                            >
                              <item.icon size={15} /> {item.label}
                            </Link>
                          ))}
                          <button onClick={handleSignOut} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--c-danger)', fontSize: '0.875rem', transition: 'all 0.15s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-danger-bg)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile hamburger */}
                  <button onClick={() => setMobileOpen(o => !o)} className="nav-show-mobile" style={{
                    background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
                    borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    {mobileOpen ? <X size={18} color="var(--c-text-1)" /> : <Menu size={18} color="var(--c-text-1)" />}
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 7 }}>
                  <Link to="/login" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '7px 14px' }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '7px 14px' }}>Get Started</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && user && (
            <div style={{
              borderTop: '1px solid var(--c-border)', padding: '12px 0 16px',
              display: 'flex', flexDirection: 'column', gap: 4,
              animation: 'slideUp 0.2s ease-out',
            }}>
              {links.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to
                return (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 9, textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
                    color: active ? 'var(--c-accent)' : 'var(--c-text-1)',
                    background: active ? 'var(--c-accent-bg)' : 'transparent',
                  }}>
                    <Icon size={18} /> {label}
                  </Link>
                )
              })}
              {isStudent && (
                <Link to="/student/ask" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 8, justifyContent: 'center' }}>
                  <PlusCircle size={16} /> Ask a Doubt
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
