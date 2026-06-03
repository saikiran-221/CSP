import { SUBJECT_MAP, getSubjectClass, getInitials, timeAgo } from '../lib/constants'
import { MessageSquare, ThumbsUp, Crown, Flag, EyeOff, ImageIcon, Video, Play } from 'lucide-react'
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

export function AvatarInitials({ name, size = 32, gradient = 'linear-gradient(135deg, #6B7CC4, #7BAE8F)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: 'white',
      flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  )
}

export function DoubtCard({ doubt }) {
  const isAnon = doubt.is_anonymous
  const displayName = isAnon ? 'Anonymous Student' : (doubt.profiles?.name || 'Student')

  return (
    <Link to={`/doubt/${doubt.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 20, marginBottom: 12, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isAnon ? (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', border: '2px dashed #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EyeOff size={16} color="#9CA3AF" />
              </div>
            ) : <AvatarInitials name={displayName} size={36} />}
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                {displayName}
                {isAnon && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 400 }}>(identity hidden)</span>}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{timeAgo(doubt.created_at)}</p>
            </div>
          </div>
          <SubjectBadge subjectId={doubt.subject} />
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600, color: '#1A1D23', lineHeight: 1.4 }}>
          {doubt.title}
        </h3>
        <p style={{ margin: '0 0 14px 0', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {doubt.description}
        </p>

        {doubt.image_url && (
          <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', maxHeight: 160 }}>
            <img src={doubt.image_url} alt="Doubt attachment" style={{ width: '100%', objectFit: 'cover', maxHeight: 160 }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#9CA3AF' }}>
            <MessageSquare size={14} /> {doubt.answer_count || 0} answers
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#9CA3AF' }}>
            <ThumbsUp size={14} /> {doubt.upvotes || 0}
          </span>
          {doubt.has_best_answer && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>
              <Crown size={14} /> Best answer
            </span>
          )}
          <StatusBadge status={doubt.status} />
        </div>
      </div>
    </Link>
  )
}

export function StatusBadge({ status }) {
  const styles = {
    open:     { background: '#FEF3C7', color: '#92400E', label: 'Open' },
    answered: { background: '#ECFDF5', color: '#065F46', label: 'Answered' },
    resolved: { background: '#EFF6FF', color: '#1D4ED8', label: 'Resolved' },
  }
  const s = styles[status] || styles.open
  return (
    <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, background: s.background, color: s.color }}>
      {s.label}
    </span>
  )
}

export function AnswerCard({ answer, onUpvote, onMarkBest, canMarkBest, isBest }) {
  const displayName = answer.profiles?.role === 'teacher'
    ? (answer.profiles?.name || 'Teacher')
    : (answer.profiles?.name || 'Student')

  const isTeacherAnswer = answer.profiles?.role === 'teacher'

  return (
    <div style={{
      border: isBest ? '2px solid #F59E0B' : '1px solid #E5E7EB',
      borderRadius: 12, padding: 20, marginBottom: 12,
      background: isBest ? '#FFFBEB' : 'white',
      position: 'relative', transition: 'all 0.2s',
    }}>
      {isBest && (
        <div style={{
          position: 'absolute', top: -11, right: 14,
          display: 'flex', alignItems: 'center', gap: 4,
          background: '#F59E0B', color: 'white',
          padding: '2px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
        }}>
          <Crown size={11} /> Best Answer
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <AvatarInitials
          name={displayName}
          size={36}
          gradient={isTeacherAnswer
            ? 'linear-gradient(135deg, #7BAE8F, #4d9068)'
            : 'linear-gradient(135deg, #6B7CC4, #5B8DB8)'}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{displayName}</p>
            {isTeacherAnswer && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, background: '#ECFDF5', color: '#065F46', padding: '1px 8px', borderRadius: 999 }}>
                🏫 Teacher
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>{timeAgo(answer.created_at)}</p>
        </div>
      </div>

      {/* Text content */}
      {answer.content && (
        <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {answer.content}
        </p>
      )}

      {/* Image attachment */}
      {answer.media_url && answer.media_type === 'image' && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
          <img
            src={answer.media_url}
            alt="Answer attachment"
            style={{ width: '100%', maxHeight: 400, objectFit: 'contain', background: '#F9FAFB', cursor: 'pointer' }}
            onClick={() => window.open(answer.media_url, '_blank')}
          />
          <div style={{ padding: '6px 12px', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ImageIcon size={13} color="#9CA3AF" />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Click image to view full size</span>
          </div>
        </div>
      )}

      {/* Video attachment */}
      {answer.media_url && answer.media_type === 'video' && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB', background: '#000' }}>
          <video
            src={answer.media_url}
            controls
            controlsList="nodownload"
            style={{ width: '100%', maxHeight: 360, display: 'block' }}
          />
          <div style={{ padding: '6px 12px', background: '#1A1D23', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Play size={13} color="#9CA3AF" />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Video explanation by teacher</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => onUpvote && onUpvote(answer.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 8, border: '1px solid #E5E7EB', background: 'white',
            fontSize: '0.8rem', fontWeight: 500, color: '#6B7280', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6B7CC4'; e.currentTarget.style.borderColor = '#C7D2FE' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}
        >
          <ThumbsUp size={14} /> {answer.upvotes || 0} Helpful
        </button>

        {canMarkBest && !isBest && (
          <button
            onClick={() => onMarkBest && onMarkBest(answer.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 8, border: '1px solid #FDE68A', background: '#FFFBEB',
              fontSize: '0.8rem', fontWeight: 500, color: '#92400E', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Crown size={14} /> Mark as Best
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon size={28} color="#9CA3AF" />
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600, color: '#374151' }}>{title}</h3>
      <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#9CA3AF' }}>{description}</p>
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
              <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: 80, height: 10 }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: '80%', height: 16, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: '100%', height: 10, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '70%', height: 10 }} />
        </div>
      ))}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search doubts...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={{ paddingLeft: 40 }}
      />
    </div>
  )
}
