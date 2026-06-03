import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, Clock, CheckCircle, BookOpen, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DoubtCard, LoadingSkeleton, EmptyState, SearchBar } from '../components/UI'
import { SUBJECT_MAP } from '../lib/constants'

export default function TeacherDashboard() {
  const { profile } = useAuth()
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({ total: 0, open: 0, answered: 0 })
  const subject = SUBJECT_MAP[profile?.subject]

  const fetchDoubts = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('doubts')
      .select('*, profiles:user_id(name, role)')
      .order('created_at', { ascending: false })
      .limit(40)

    if (profile?.subject) query = query.eq('subject', profile.subject)
    if (filter === 'open') query = query.eq('status', 'open')
    if (filter === 'answered') query = query.in('status', ['answered', 'resolved'])
    if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)

    const { data } = await query

    // Fetch answer counts separately
    const doubtIds = (data || []).map(d => d.id)
    let answerCounts = {}
    if (doubtIds.length > 0) {
      const { data: answers } = await supabase
        .from('answers')
        .select('doubt_id, is_best_answer')
        .in('doubt_id', doubtIds)
      ;(answers || []).forEach(a => {
        if (!answerCounts[a.doubt_id]) answerCounts[a.doubt_id] = { count: 0, hasBest: false }
        answerCounts[a.doubt_id].count++
        if (a.is_best_answer) answerCounts[a.doubt_id].hasBest = true
      })
    }

    const processed = (data || []).map(d => ({
      ...d,
      answer_count: answerCounts[d.id]?.count || 0,
      has_best_answer: answerCounts[d.id]?.hasBest || false,
    }))
    setDoubts(processed)
    setLoading(false)
  }, [profile?.subject, filter, search])

  useEffect(() => { fetchDoubts() }, [fetchDoubts])

  useEffect(() => {
    async function loadStats() {
      if (!profile?.subject) return
      const { data } = await supabase.from('doubts').select('status').eq('subject', profile.subject)
      if (data) {
        setStats({
          total: data.length,
          open: data.filter(d => d.status === 'open').length,
          answered: data.filter(d => d.status !== 'open').length,
        })
      }
    }
    loadStats()
  }, [profile?.subject])

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '28px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: '#1A1D23' }}>
            Teacher Dashboard
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
            {subject ? `Showing doubts for ${subject.emoji} ${subject.label}` : 'No subject assigned yet'}
          </p>
        </div>

        {/* Subject Banner */}
        {subject && (
          <div style={{ background: 'linear-gradient(135deg, #7BAE8F, #4d9068)', borderRadius: 12, padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '2.5rem' }}>{subject.emoji}</span>
            <div>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                {subject.label} Faculty
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                You can view and answer all {subject.label} doubts
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Doubts', value: stats.total, icon: BookOpen, color: '#6B7CC4', bg: '#EEF2FF' },
            { label: 'Needs Answer', value: stats.open, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Answered', value: stats.answered, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1D23' }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search student doubts..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'open', 'answered'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                borderColor: filter === f ? '#7BAE8F' : '#E5E7EB',
                background: filter === f ? '#F0FDF4' : 'white',
                color: filter === f ? '#15803D' : '#6B7280',
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {!profile?.subject ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No subject assigned to your account. Please contact admin.</p>
          </div>
        ) : loading ? <LoadingSkeleton count={4} /> : doubts.length === 0 ? (
          <EmptyState icon={BookOpen} title="No doubts yet" description={`No ${subject?.label} doubts ${filter !== 'all' ? `with status "${filter}"` : ''} found.`} />
        ) : (
          <div>{doubts.map(d => <DoubtCard key={d.id} doubt={d} />)}</div>
        )}
      </div>
    </div>
  )
}
