import { useState, useEffect } from 'react'
import { Shield, Flag, Trash2, Check, X, AlertTriangle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo } from '../lib/constants'
import { EmptyState } from '../components/UI'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ModerationPanel() {
  const { profile } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => { fetchReports() }, [])

  async function fetchReports() {
    setLoading(true)
    const { data, error } = await supabase
      .from('reports')
      .select('*, doubts:target_id(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  async function dismissReport(reportId) {
    setProcessing(reportId)
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId)
    toast.success('Report dismissed')
    fetchReports()
    setProcessing(null)
  }

  async function deleteDoubt(reportId, doubtId) {
    if (!window.confirm('Delete this doubt? This cannot be undone.')) return
    setProcessing(reportId)
    await supabase.from('doubts').delete().eq('id', doubtId)
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
    toast.success('Doubt deleted and report resolved')
    fetchReports()
    setProcessing(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '28px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-text-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={22} color="var(--c-accent)" /> Moderation Panel
            </h1>
            <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.9rem' }}>Review and act on reported content</p>
          </div>
          <button onClick={fetchReports} className="btn btn-ghost" style={{ gap: 6, fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {reports.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--c-warning-bg)', border: '1px solid var(--c-warning-border)', borderRadius: 10, padding: '10px 16px', marginBottom: 20 }}>
            <AlertTriangle size={16} color="var(--c-warning)" />
            <span style={{ fontSize: '0.875rem', color: '#92400E', fontWeight: 500 }}>
              {reports.length} pending {reports.length === 1 ? 'report' : 'reports'} need review
            </span>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : reports.length === 0 ? (
          <EmptyState icon={Shield} title="No pending reports" description="All reported content has been reviewed. Great job!" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reports.map(r => (
              <div key={r.id} className="card" style={{ padding: 22, borderLeft: '4px solid var(--c-warning)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flag size={16} color="var(--c-warning)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400E', background: 'var(--c-warning-bg)', padding: '2px 10px', borderRadius: 999 }}>
                      Reported Doubt
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--c-text-3)' }}>{timeAgo(r.created_at)}</span>
                  </div>
                </div>

                {r.doubts && (
                  <div style={{ background: 'var(--c-surface-2)', borderRadius: 9, padding: '12px 16px', marginBottom: 14 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{r.doubts.title}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--c-text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.doubts.description}
                    </p>
                    <Link to={`/doubt/${r.target_id}`} style={{ display: 'inline-block', marginTop: 8, fontSize: '0.78rem', color: 'var(--c-accent)', textDecoration: 'none', fontWeight: 500 }}>
                      View full doubt →
                    </Link>
                  </div>
                )}

                <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400E' }}>
                    <strong>Report reason:</strong> {r.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => deleteDoubt(r.id, r.target_id)}
                    disabled={processing === r.id}
                    className="btn btn-danger"
                    style={{ gap: 6, fontSize: '0.82rem', padding: '8px 16px' }}
                  >
                    <Trash2 size={14} /> Delete Doubt
                  </button>
                  <button
                    onClick={() => dismissReport(r.id)}
                    disabled={processing === r.id}
                    className="btn btn-ghost"
                    style={{ gap: 6, fontSize: '0.82rem', padding: '8px 16px' }}
                  >
                    <X size={14} /> Dismiss Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
