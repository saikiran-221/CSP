import { SUBJECT_MAP, getSubjectClass, getInitials, timeAgo } from '../lib/constants'
import { MessageSquare, ThumbsUp, Crown, EyeOff, ImageIcon, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SubjectBadge({ subjectId, size = 'sm' }) {
  const subject = SUBJECT_MAP[subjectId]
  if (!subject) return null
  return (
    <span className={`badge ${getSubjectClass(subjectId)}`} style={{ fontSize: size === 'xs' ? '0.7rem' : '0.75rem' }}>
      {subject.emoji} {subject.label}
    </span>
  )
}

export function AvatarInitials({ name, size = 32, gradient }) {
  const g = gradient || 'linear-gradient(135deg, var(--c-accent), var(--c-sage))'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: g, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: 'white', flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  )
}

export function StatusBadge({ status }) {
  const styles = {
    open:     { bg: 'var(--c-warning-bg)', color: 'var(--c-warning)', label: '● Open' },
    answered: { bg: 'var(--c-success-bg)', color: 'var(--c-success)', label: '✓ Answered' },
    resolved: { bg: 'var(--c-accent-bg)',  color: 'var(--c-accent)',  label: '★ Resolved' },
  }
  const s = styles[status] || styles.open
  return (
    <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export function DoubtCard({ doubt }) {
  const isAnon = doubt.is_anonymous
  const displayName = isAnon ? 'Anonymous Student' : (doubt.profiles?.name || 'Student')
  return (
    <Link to={`/doubt/${doubt.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {isAnon ? (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--c-surface-2)', border: '2px dashed var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EyeOff size={15} color="var(--c-text-3)" />
              </div>
            ) : <AvatarInitials name={displayName} size={36} />}
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text-1)' }}>
                {displayName}
                {isAnon && <span style={{ marginLeft: 6, fontSize: '0.68rem', color: 'var(--c-text-3)' }}>(hidden)</span>}
              </p>
              <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--c-text-3)' }}>{timeAgo(doubt.created_at)}</p>
            </div>
          </div>
          <div className="doubt-card-subject">
            <SubjectBadge subjectId={doubt.subject} />
          </div>
        </div>

        <h3 style={{ margin: '0 0 8px', fontSize: '0.975rem', fontWeight: 600, color: 'var(--c-text-1)', lineHeight: 1.4 }}>
          {doubt.title}
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--c-text-2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {doubt.description}
        </p>

        {doubt.image_url && (
          <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', maxHeight: 140, background: 'var(--c-surface-2)' }}>
            <img src={doubt.image_url} alt="attachment" style={{ width: '100%', objectFit: 'cover', maxHeight: 140 }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--c-border-2)', paddingTop: 11, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--c-text-3)' }}>
            <MessageSquare size={13} /> {doubt.answer_count || 0}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--c-text-3)' }}>
            <ThumbsUp size={13} /> {doubt.upvotes || 0}
          </span>
          {doubt.has_best_answer && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--c-warning)', fontWeight: 600 }}>
              <Crown size={13} /> Best
            </span>
          )}
          <StatusBadge status={doubt.status} />
        </div>
      </div>
    </Link>
  )
}

export function AnswerCard({ answer, onUpvote, onMarkBest, canMarkBest, isBest }) {
  const displayName = answer.profiles?.name || 'User'
  const isTeacher = answer.profiles?.role === 'teacher'

  return (
    <div style={{
      border: isBest ? '2px solid var(--c-warning)' : '1px solid var(--c-border)',
      borderRadius: 12, padding: 20, marginBottom: 12,
      background: isBest ? 'var(--c-warning-bg)' : 'var(--c-surface)',
      position: 'relative', transition: 'all 0.2s',
    }}>
      {isBest && (
        <div style={{
          position: 'absolute', top: -11, right: 14,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'var(--c-warning)', color: 'white',
          padding: '2px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
        }}>
          <Crown size={11} /> Best Answer
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <AvatarInitials name={displayName} size={36}
          gradient={isTeacher ? 'linear-gradient(135deg, var(--c-sage), var(--c-sage-2))' : 'linear-gradient(135deg, var(--c-accent), var(--c-accent-2))'}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{displayName}</p>
            {isTeacher && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--c-success-bg)', color: 'var(--c-success)', padding: '1px 8px', borderRadius: 999 }}>
                🏫 Teacher
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--c-text-3)' }}>{timeAgo(answer.created_at)}</p>
        </div>
      </div>

      {answer.content && (
        <p style={{ margin: '0 0 14px', fontSize: '0.9rem', color: 'var(--c-text-1)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {answer.content}
        </p>
      )}

      {answer.media_url && answer.media_type === 'image' && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--c-border)' }}>
          <img src={answer.media_url} alt="attachment" style={{ width: '100%', maxHeight: 360, objectFit: 'contain', background: 'var(--c-surface-2)', cursor: 'pointer' }} onClick={() => window.open(answer.media_url, '_blank')} />
          <div style={{ padding: '6px 12px', background: 'var(--c-surface-2)', borderTop: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <ImageIcon size={12} color="var(--c-text-3)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--c-text-3)' }}>Click to view full size</span>
          </div>
        </div>
      )}

      {answer.media_url && answer.media_type === 'video' && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--c-border)', background: '#000' }}>
          <video src={answer.media_url} controls controlsList="nodownload" style={{ width: '100%', maxHeight: 320, display: 'block' }} />
          <div style={{ padding: '6px 12px', background: '#111', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Play size={12} color="#9CA3AF" />
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Video by teacher</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => onUpvote?.(answer.id)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px',
          borderRadius: 8, border: '1px solid var(--c-border)', background: 'var(--c-surface-2)',
          fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text-2)', cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-accent-bg)'; e.currentTarget.style.color = 'var(--c-accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-surface-2)'; e.currentTarget.style.color = 'var(--c-text-2)'; }}
        >
          <ThumbsUp size={13} /> {answer.upvotes || 0} Helpful
        </button>

        {canMarkBest && !isBest && (
          <button onClick={() => onMarkBest?.(answer.id)} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px',
            borderRadius: 8, border: '1px solid var(--c-warning-border)', background: 'var(--c-warning-bg)',
            fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-warning)', cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <Crown size={13} /> Mark as Best
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--c-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon size={28} color="var(--c-text-3)" />
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{title}</h3>
      <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--c-text-3)' }}>{description}</p>
      {action}
    </div>
  )
}

export function LoadingSkeleton({ count = 3 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div>
              <div className="skeleton" style={{ width: 120, height: 12, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: 80, height: 9 }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: '75%', height: 14, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: '100%', height: 9, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '65%', height: 9 }} />
        </div>
      ))}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search doubts...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)', flexShrink: 0 }} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" style={{ paddingLeft: 38 }} />
    </div>
  )
}
