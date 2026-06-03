import { useState, useEffect } from 'react'
import { User, Edit3, Save, X, Mail, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { AvatarInitials } from '../components/UI'
import { SUBJECT_MAP } from '../lib/constants'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.name || '')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ doubts: 0, answers: 0, upvotes: 0 })

  useEffect(() => {
    setName(profile?.name || '')
    if (user) loadStats()
  }, [profile, user])

  async function loadStats() {
    const [d, a] = await Promise.all([
      supabase.from('doubts').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('answers').select('upvotes').eq('user_id', user.id),
    ])
    const upvotesTotal = (a.data || []).reduce((sum, row) => sum + (row.upvotes || 0), 0)
    setStats({ doubts: d.count || 0, answers: (a.data || []).length, upvotes: upvotesTotal })
  }

  async function saveProfile() {
    if (!name.trim()) return toast.error('Name cannot be empty')
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ name: name.trim() }).eq('id', user.id)
    if (!error) {
      await refreshProfile()
      toast.success('Profile updated!')
      setEditing(false)
    } else {
      toast.error('Failed to update profile')
    }
    setSaving(false)
  }

  const subject = profile?.subject ? SUBJECT_MAP[profile.subject] : null

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '28px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: '1.5rem', fontWeight: 700, color: '#1A1D23' }}>My Profile</h1>

        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          {/* Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #F3F4F6' }}>
            <AvatarInitials name={profile?.name || 'U'} size={72} />
            <div style={{ flex: 1 }}>
              {editing ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={name} onChange={e => setName(e.target.value)} className="input" style={{ flex: 1, fontSize: '1.1rem', fontWeight: 600 }} autoFocus />
                  <button onClick={saveProfile} disabled={saving} className="btn btn-sage" style={{ gap: 5, padding: '8px 14px' }}>
                    <Save size={15} /> {saving ? '...' : 'Save'}
                  </button>
                  <button onClick={() => { setEditing(false); setName(profile?.name || '') }} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1A1D23' }}>{profile?.name}</h2>
                  <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                  background: profile?.role === 'teacher' ? '#ECFDF5' : '#EEF2FF',
                  color: profile?.role === 'teacher' ? '#065F46' : '#4338CA',
                  textTransform: 'capitalize'
                }}>
                  {profile?.role}
                </span>
                {subject && (
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500, background: '#F3F4F6', color: '#6B7280' }}>
                    {subject.emoji} {subject.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={16} color="#6B7CC4" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Email</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{user?.email}</p>
              </div>
            </div>
            {subject && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={16} color="#10B981" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Subject</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{subject.emoji} {subject.label}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Doubts Posted', value: stats.doubts, color: '#6B7CC4', bg: '#EEF2FF' },
            { label: 'Answers Given', value: stats.answers, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Upvotes Earned', value: stats.upvotes, color: '#F59E0B', bg: '#FFFBEB' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
