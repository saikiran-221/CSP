import { useState, useEffect } from 'react'
import { FileQuestion, Clock, CheckCircle, Crown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DoubtCard, LoadingSkeleton, EmptyState } from '../components/UI'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

export default function MyDoubtsPage() {
  const { user } = useAuth()
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchMyDoubts() {
      setLoading(true)
      let query = supabase
        .from('doubts')
        .select('*, profiles:user_id(name, role)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filter === 'open') query = query.eq('status', 'open')
      if (filter === 'answered') query = query.eq('status', 'answered')
      if (filter === 'resolved') query = query.eq('status', 'resolved')

      const { data } = await query
      setDoubts(data || [])
      setLoading(false)
    }
    fetchMyDoubts()
  }, [user.id, filter])

  const tabs = [
    { key: 'all', label: 'All', icon: FileQuestion },
    { key: 'open', label: 'Open', icon: Clock },
    { key: 'answered', label: 'Answered', icon: CheckCircle },
    { key: 'resolved', label: 'Resolved', icon: Crown },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '28px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: '#1A1D23' }}>My Doubts</h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Track all your posted questions</p>
          </div>
          <Link to="/student/ask" className="btn btn-primary" style={{ textDecoration: 'none', gap: 7 }}>
            <PlusCircle size={16} /> New Doubt
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'white', borderRadius: 10, padding: 4, border: '1px solid #E5E7EB', overflowX: 'auto' }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.15s',
              background: filter === key ? '#EEF2FF' : 'transparent',
              color: filter === key ? '#6B7CC4' : '#6B7280',
            }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading ? <LoadingSkeleton count={3} /> : doubts.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No doubts here"
            description={filter === 'all' ? "You haven't posted any doubts yet." : `No ${filter} doubts.`}
            action={filter === 'all' && <Link to="/student/ask" className="btn btn-primary" style={{ textDecoration: 'none' }}>Ask Your First Doubt</Link>}
          />
        ) : doubts.map(d => <DoubtCard key={d.id} doubt={d} />)}
      </div>
    </div>
  )
}
