import { useState, useEffect } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo } from '../lib/constants'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/UI'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      setLoading(false)
    }
    fetchNotifications()
  }, [user])

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  async function markRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '28px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-text-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={22} /> Notifications
              {unreadCount > 0 && (
                <span style={{ background: 'var(--c-accent)', color: 'white', borderRadius: 999, padding: '2px 9px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.9rem' }}>Stay updated on your doubts</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-ghost" style={{ gap: 6, fontSize: '0.8rem' }}>
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="No notifications yet" description="You'll be notified when someone answers your doubts." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                borderRadius: 10, border: '1px solid', cursor: 'pointer',
                background: n.is_read ? 'var(--c-surface)' : 'var(--c-accent-bg)',
                borderColor: n.is_read ? 'var(--c-border)' : 'var(--c-accent-border)',
                transition: 'all 0.15s',
              }} onClick={() => { markRead(n.id) }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: n.is_read ? 'var(--c-surface-2)' : 'linear-gradient(135deg, var(--c-accent), var(--c-sage))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bell size={16} color={n.is_read ? 'var(--c-text-3)' : 'white'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.875rem', color: 'var(--c-text-1)', fontWeight: n.is_read ? 400 : 600, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--c-text-3)' }}>{timeAgo(n.created_at)}</p>
                </div>
                {n.doubt_id && (
                  <Link to={`/doubt/${n.doubt_id}`} style={{ padding: '5px 12px', borderRadius: 7, background: 'var(--c-accent)', color: 'white', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    View
                  </Link>
                )}
                {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-accent)', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
