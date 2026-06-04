import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, TrendingUp, Clock, CheckCircle, BookOpen, Filter, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SUBJECTS } from '../lib/constants'
import { DoubtCard, LoadingSkeleton, EmptyState, SearchBar } from '../components/UI'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({ total: 0, open: 0, answered: 0 })
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const fetchDoubts = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('doubts')
        .select('*, profiles:user_id(name, role)')
        .order('created_at', { ascending: false })
        .limit(30)

      if (selectedSubject) query = query.eq('subject', selectedSubject)
      if (filter === 'open') query = query.eq('status', 'open')
      if (filter === 'answered') query = query.in('status', ['answered', 'resolved'])
      if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)

      const { data, error } = await query
      if (error) throw error

      const doubtIds = (data || []).map(d => d.id)
      let answerCounts = {}
      if (doubtIds.length > 0) {
        const { data: answers } = await supabase.from('answers').select('doubt_id, is_best_answer').in('doubt_id', doubtIds)
        ;(answers || []).forEach(a => {
          if (!answerCounts[a.doubt_id]) answerCounts[a.doubt_id] = { count: 0, hasBest: false }
          answerCounts[a.doubt_id].count++
          if (a.is_best_answer) answerCounts[a.doubt_id].hasBest = true
        })
      }

      setDoubts((data || []).map(d => ({
        ...d,
        answer_count: answerCounts[d.id]?.count || 0,
        has_best_answer: answerCounts[d.id]?.hasBest || false,
      })))
    } catch (err) {
      toast.error('Failed to load doubts')
    } finally {
      setLoading(false)
    }
  }, [search, selectedSubject, filter])

  useEffect(() => {
    const t = setTimeout(fetchDoubts, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchDoubts])

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase.from('doubts').select('status')
      if (data) setStats({ total: data.length, open: data.filter(d => d.status === 'open').length, answered: data.filter(d => d.status !== 'open').length })
    }
    loadStats()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="bg-page" style={{ padding: 0 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title" style={{ margin: '0 0 3px', fontSize: '1.4rem', fontWeight: 700, color: 'var(--c-text-1)' }}>
              {greeting()}, {profile?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.875rem' }}>Discover and answer doubts</p>
          </div>
          <Link to="/student/ask" className="btn btn-primary hide-mobile" style={{ textDecoration: 'none', gap: 7 }}>
            <PlusCircle size={16} /> Ask a Doubt
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total', value: stats.total, icon: BookOpen, color: 'var(--c-accent)', bg: 'var(--c-accent-bg)' },
            { label: 'Open', value: stats.open, icon: Clock, color: 'var(--c-warning)', bg: 'var(--c-warning-bg)' },
            { label: 'Answered', value: stats.answered, icon: CheckCircle, color: 'var(--c-success)', bg: 'var(--c-success-bg)' },
          ].map((s, i) => (
            <div key={i} className="card stat-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p className="stat-value" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--c-text-1)' }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--c-text-3)' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="dashboard-grid">
          {/* Feed */}
          <div>
            {/* Filters bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <SearchBar value={search} onChange={setSearch} placeholder="Search doubts..." />
                </div>
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilter(o => !o)}
                  className="btn btn-ghost show-mobile"
                  style={{ display: 'none', padding: '0 12px', border: selectedSubject ? '1px solid var(--c-accent)' : undefined, color: selectedSubject ? 'var(--c-accent)' : undefined }}
                >
                  <Filter size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'open', 'answered'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '6px 16px', borderRadius: 8, border: '1px solid', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
                    borderColor: filter === f ? 'var(--c-accent)' : 'var(--c-border)',
                    background: filter === f ? 'var(--c-accent-bg)' : 'var(--c-surface)',
                    color: filter === f ? 'var(--c-accent)' : 'var(--c-text-2)',
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                {selectedSubject && (
                  <button onClick={() => setSelectedSubject('')} style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8,
                    border: '1px solid var(--c-sage)', background: 'var(--c-sage-bg)',
                    color: 'var(--c-sage-2)', fontSize: '0.8rem', cursor: 'pointer',
                  }}>
                    {SUBJECTS.find(s => s.id === selectedSubject)?.emoji} {SUBJECTS.find(s => s.id === selectedSubject)?.label} <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {loading ? <LoadingSkeleton count={4} /> : doubts.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No doubts found"
                description={search ? `No results for "${search}"` : 'Be the first to ask a doubt!'}
                action={<Link to="/student/ask" className="btn btn-primary" style={{ textDecoration: 'none' }}>Ask First Doubt</Link>}
              />
            ) : (
              <div className="animate-fade-in">{doubts.map(d => <DoubtCard key={d.id} doubt={d} />)}</div>
            )}
          </div>

          {/* Sidebar — desktop */}
          <div className="dashboard-sidebar">
            <div className="card-flat" style={{ padding: 18, marginBottom: 14 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} color="var(--c-text-3)" /> Filter by Subject
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => setSelectedSubject('')} style={{
                  textAlign: 'left', padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: selectedSubject === '' ? 600 : 400,
                  background: selectedSubject === '' ? 'var(--c-accent-bg)' : 'transparent',
                  color: selectedSubject === '' ? 'var(--c-accent)' : 'var(--c-text-2)',
                }}>📚 All Subjects</button>
                {SUBJECTS.map(s => (
                  <button key={s.id} onClick={() => setSelectedSubject(s.id === selectedSubject ? '' : s.id)} style={{
                    textAlign: 'left', padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: selectedSubject === s.id ? 600 : 400,
                    background: selectedSubject === s.id ? 'var(--c-accent-bg)' : 'transparent',
                    color: selectedSubject === s.id ? 'var(--c-accent)' : 'var(--c-text-2)',
                  }}>{s.emoji} {s.label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-sage))', borderRadius: 12, padding: 18 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: 16, color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', lineHeight: 2.2 }}>
                <li>Search before asking</li>
                <li>Use anonymous mode</li>
                <li>Upload images for diagrams</li>
                <li>Upvote helpful answers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile floating ask button */}
        <Link to="/student/ask" className="show-mobile" style={{
          display: 'none', position: 'fixed', bottom: 20, right: 16,
          background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-2))',
          color: 'white', borderRadius: 14, padding: '12px 20px', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.9rem', gap: 8, alignItems: 'center',
          boxShadow: '0 6px 24px rgba(107,124,196,0.45)', zIndex: 40,
        }}>
          <PlusCircle size={18} /> Ask Doubt
        </Link>
      </div>
    </div>
  )
}
