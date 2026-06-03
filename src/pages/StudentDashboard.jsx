import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, TrendingUp, Clock, CheckCircle, BookOpen, Filter } from 'lucide-react'
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

      // Fetch answer counts separately for each doubt
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
    } catch (err) {
      console.error(err)
      toast.error('Failed to load doubts')
    } finally {
      setLoading(false)
    }
  }, [search, selectedSubject, filter])

  useEffect(() => {
    const timer = setTimeout(fetchDoubts, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchDoubts])

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase.from('doubts').select('status')
      if (data) {
        setStats({
          total: data.length,
          open: data.filter(d => d.status === 'open').length,
          answered: data.filter(d => d.status !== 'open').length,
        })
      }
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
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: '#1A1D23' }}>
              {greeting()}, {profile?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Discover doubts and learn from answers</p>
          </div>
          <Link to="/student/ask" className="btn btn-primary" style={{ textDecoration: 'none', gap: 8 }}>
            <PlusCircle size={17} /> Ask a Doubt
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Doubts', value: stats.total, icon: BookOpen, color: '#6B7CC4', bg: '#EEF2FF' },
            { label: 'Open', value: stats.open, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Answered', value: stats.answered, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1A1D23' }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#9CA3AF' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 260px', gap: 24, alignItems: 'start' }}>
          {/* Main Feed */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search doubts by keyword..." />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'open', 'answered'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '6px 16px', borderRadius: 8, border: '1px solid', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
                    borderColor: filter === f ? '#6B7CC4' : '#E5E7EB',
                    background: filter === f ? '#EEF2FF' : 'white',
                    color: filter === f ? '#6B7CC4' : '#6B7280',
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
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
              <div className="animate-fade-in">
                {doubts.map(d => <DoubtCard key={d.id} doubt={d} />)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} /> Filter by Subject
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => setSelectedSubject('')} style={{
                  textAlign: 'left', padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: selectedSubject === '' ? 600 : 400,
                  background: selectedSubject === '' ? '#EEF2FF' : 'transparent',
                  color: selectedSubject === '' ? '#6B7CC4' : '#6B7280',
                }}>
                  📚 All Subjects
                </button>
                {SUBJECTS.map(s => (
                  <button key={s.id} onClick={() => setSelectedSubject(s.id === selectedSubject ? '' : s.id)} style={{
                    textAlign: 'left', padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: selectedSubject === s.id ? 600 : 400,
                    background: selectedSubject === s.id ? '#EEF2FF' : 'transparent',
                    color: selectedSubject === s.id ? '#6B7CC4' : '#6B7280',
                  }}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)', borderRadius: 12, padding: 18 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: 16, color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', lineHeight: 2 }}>
                <li>Search before asking</li>
                <li>Use anonymous mode if hesitant</li>
                <li>Upload images for diagrams</li>
                <li>Upvote helpful answers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
