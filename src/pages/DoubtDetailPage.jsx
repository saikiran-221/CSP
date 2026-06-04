import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Send, Flag, Crown, ThumbsUp, EyeOff,
  MessageSquare, Trash2, ImagePlus, Video, X, FileText,
  Upload, AlertCircle
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SubjectBadge, AvatarInitials, AnswerCard, LoadingSkeleton, StatusBadge } from '../components/UI'
import { timeAgo, containsBadWord } from '../lib/constants'
import toast from 'react-hot-toast'

// ─── Answer Compose Box ────────────────────────────────────────────────────────
function AnswerComposer({ onSubmit, isTeacher }) {
  const [text, setText] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'image' | 'video'
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('text') // 'text' | 'image' | 'video'
  const imageRef = useRef()
  const videoRef = useRef()

  const handleFileSelect = (file, type) => {
    if (!file) return
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    const maxLabel = type === 'video' ? '50MB' : '5MB'
    if (file.size > maxSize) {
      toast.error(`${type === 'video' ? 'Video' : 'Image'} must be under ${maxLabel}`)
      return
    }
    setMediaFile(file)
    setMediaType(type)
    setMediaPreview(URL.createObjectURL(file))
    setActiveTab(type)
  }

  const clearMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
    setMediaType(null)
    if (imageRef.current) imageRef.current.value = ''
    if (videoRef.current) videoRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!text.trim() && !mediaFile) {
      toast.error('Please write an answer or attach a file')
      return
    }
    if (text.trim() && containsBadWord(text)) {
      toast.error('Answer contains inappropriate language')
      return
    }
    setUploading(true)
    await onSubmit({ text: text.trim(), mediaFile, mediaType })
    setText('')
    clearMedia()
    setActiveTab('text')
    setUploading(false)
  }

  const tabs = [
    { key: 'text', icon: FileText, label: 'Text' },
    { key: 'image', icon: ImagePlus, label: 'Photo' },
    { key: 'video', icon: Video, label: 'Video' },
  ]

  return (
    <div className="card" style={{ padding: 24, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--c-text-1)' }}>
          {isTeacher ? '🏫 Post Your Answer' : '💬 Your Answer'}
        </h3>
        {isTeacher && (
          <span style={{ fontSize: '0.75rem', color: 'var(--c-text-2)', background: 'var(--c-surface-2)', padding: '3px 10px', borderRadius: 999 }}>
            Visible to student
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--c-surface-2)', borderRadius: 10, padding: 4 }}>
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key)
              if (key === 'image') setTimeout(() => imageRef.current?.click(), 50)
              if (key === 'video') setTimeout(() => videoRef.current?.click(), 50)
            }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.15s',
              background: activeTab === key ? 'var(--c-surface)' : 'transparent',
              color: activeTab === key ? 'var(--c-accent)' : 'var(--c-text-2)',
              boxShadow: activeTab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFileSelect(e.target.files[0], 'image')}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={e => handleFileSelect(e.target.files[0], 'video')}
      />

      {/* Text area — always visible */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={
          isTeacher
            ? 'Provide a clear, step-by-step explanation... (you can also attach a photo or video below)'
            : 'Share your understanding or suggestion...'
        }
        className="input textarea"
        style={{ minHeight: 110, marginBottom: 14, resize: 'vertical' }}
      />

      {/* Media preview */}
      {mediaPreview && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--c-border)', position: 'relative' }}>
          {/* Remove button */}
          <button
            onClick={clearMedia}
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 2,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} color="white" />
          </button>

          {mediaType === 'image' && (
            <>
              <img
                src={mediaPreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: 280, objectFit: 'contain', background: 'var(--c-surface-2)', display: 'block' }}
              />
              <div style={{ padding: '8px 14px', background: 'var(--c-surface-2)', borderTop: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ImagePlus size={13} color="var(--c-sage)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--c-text-2)' }}>
                  {mediaFile?.name} · {(mediaFile?.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </>
          )}

          {mediaType === 'video' && (
            <>
              <video
                src={mediaPreview}
                controls
                style={{ width: '100%', maxHeight: 260, background: '#000', display: 'block' }}
              />
              <div style={{ padding: '8px 14px', background: 'var(--c-text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Video size={13} color="var(--c-sage)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--c-text-3)' }}>
                  {mediaFile?.name} · {(mediaFile?.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Upload tip for video */}
      {activeTab === 'video' && !mediaPreview && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F0F9FF', borderRadius: 8, marginBottom: 14, border: '1px solid #BAE6FD' }}>
          <AlertCircle size={14} color="#0369A1" />
          <span style={{ fontSize: '0.78rem', color: '#0369A1' }}>
            Max video size: 50MB · Supported: MP4, MOV, WebM
          </span>
        </div>
      )}

      {/* Submit row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Quick attach buttons */}
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
              borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem',
              background: mediaType === 'image' ? 'var(--c-sage-bg)' : 'var(--c-surface)',
              borderColor: mediaType === 'image' ? '#86EFAC' : 'var(--c-border)',
              color: mediaType === 'image' ? '#15803D' : 'var(--c-text-2)',
              transition: 'all 0.15s',
            }}
          >
            <ImagePlus size={14} />
            {mediaType === 'image' ? '1 photo' : 'Photo'}
          </button>
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
              borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem',
              background: mediaType === 'video' ? '#F0F9FF' : 'var(--c-surface)',
              borderColor: mediaType === 'video' ? '#BAE6FD' : 'var(--c-border)',
              color: mediaType === 'video' ? '#0369A1' : 'var(--c-text-2)',
              transition: 'all 0.15s',
            }}
          >
            <Video size={14} />
            {mediaType === 'video' ? '1 video' : 'Video'}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading || (!text.trim() && !mediaFile)}
          className="btn btn-primary"
          style={{ gap: 7, minWidth: 120 }}
        >
          {uploading ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              {mediaFile ? 'Uploading...' : 'Posting...'}
            </>
          ) : (
            <><Send size={15} /> Post Answer</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DoubtDetailPage() {
  const { id } = useParams()
  const { user, profile, isTeacher, isStudent } = useAuth()
  const navigate = useNavigate()
  const [doubt, setDoubt] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportReason, setReportReason] = useState('')
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    fetchDoubt()
    fetchAnswers()
  }, [id])

  async function fetchDoubt() {
    const { data, error } = await supabase
      .from('doubts')
      .select('*, profiles:user_id(name, role)')
      .eq('id', id)
      .single()
    if (!error) setDoubt(data)
    setLoading(false)
  }

  async function fetchAnswers() {
    const { data } = await supabase
      .from('answers')
      .select('*, profiles:user_id(name, role)')
      .eq('doubt_id', id)
      .order('is_best_answer', { ascending: false })
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: true })
    setAnswers(data || [])
  }

  async function uploadMedia(file, type) {
    const ext = file.name.split('.').pop()
    const folder = type === 'video' ? 'answer-videos' : 'answer-images'
    const path = `${folder}/${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('doubt-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw new Error('Upload failed: ' + error.message)
    const { data } = supabase.storage.from('doubt-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmitAnswer({ text, mediaFile, mediaType }) {
    try {
      let mediaUrl = null
      if (mediaFile) {
        toast.loading('Uploading media...', { id: 'upload' })
        mediaUrl = await uploadMedia(mediaFile, mediaType)
        toast.dismiss('upload')
      }

      const { error } = await supabase.from('answers').insert({
        doubt_id: id,
        user_id: user.id,
        content: text || '',
        upvotes: 0,
        is_best_answer: false,
        media_url: mediaUrl,
        media_type: mediaFile ? mediaType : null,
      })
      if (error) throw error

      // Update doubt status
      await supabase.from('doubts').update({ status: 'answered' }).eq('id', id)

      // Notify student
      if (doubt && doubt.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: doubt.user_id,
          message: `${profile?.name || 'Someone'} answered your doubt: "${doubt.title.slice(0, 50)}"`,
          doubt_id: id,
          is_read: false,
        })
      }

      toast.success('Answer posted successfully!')
      fetchAnswers()
      fetchDoubt()
    } catch (err) {
      toast.dismiss('upload')
      toast.error(err.message || 'Failed to post answer')
      throw err // re-throw so composer resets uploading state
    }
  }

  async function handleUpvoteAnswer(answerId) {
    const answer = answers.find(a => a.id === answerId)
    if (!answer) return
    await supabase.from('answers').update({ upvotes: (answer.upvotes || 0) + 1 }).eq('id', answerId)
    fetchAnswers()
  }

  async function handleMarkBest(answerId) {
    await supabase.from('answers').update({ is_best_answer: false }).eq('doubt_id', id)
    await supabase.from('answers').update({ is_best_answer: true }).eq('id', answerId)
    await supabase.from('doubts').update({ status: 'resolved' }).eq('id', id)
    toast.success('Best answer marked! 🏆')
    fetchAnswers()
    fetchDoubt()
  }

  async function handleDeleteDoubt() {
    if (!window.confirm('Delete this doubt? This action cannot be undone.')) return
    await supabase.from('doubts').delete().eq('id', id)
    toast.success('Doubt deleted')
    navigate(-1)
  }

  async function submitReport() {
    if (!reportReason.trim()) return toast.error('Please provide a reason')
    const { error } = await supabase.from('reports').insert({
      target_type: 'doubt',
      target_id: id,
      reported_by: user.id,
      reason: reportReason,
      status: 'pending',
    })
    if (!error) {
      toast.success('Report submitted. Moderators will review it.')
      setShowReport(false)
      setReportReason('')
    }
  }

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
      <LoadingSkeleton count={2} />
    </div>
  )

  if (!doubt) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ color: 'var(--c-text-3)' }}>Doubt not found.</p>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginTop: 12 }}>Go Back</button>
    </div>
  )

  const isOwner = user?.id === doubt.user_id
  const displayName = doubt.is_anonymous ? 'Anonymous Student' : (doubt.profiles?.name || 'Student')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '24px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 20, gap: 7 }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Doubt Card */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {doubt.is_anonymous ? (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--c-surface-2)', border: '2px dashed var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EyeOff size={18} color="var(--c-text-3)" />
                </div>
              ) : <AvatarInitials name={displayName} size={40} />}
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{displayName}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--c-text-3)' }}>{timeAgo(doubt.created_at)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <SubjectBadge subjectId={doubt.subject} />
              <StatusBadge status={doubt.status} />
            </div>
          </div>

          <h1 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-text-1)', lineHeight: 1.4 }}>
            {doubt.title}
          </h1>
          <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--c-text-2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {doubt.description}
          </p>

          {doubt.image_url && (
            <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--c-border)' }}>
              <img
                src={doubt.image_url}
                alt="Doubt attachment"
                style={{ width: '100%', maxHeight: 350, objectFit: 'contain', background: 'var(--c-surface-2)', cursor: 'pointer' }}
                onClick={() => window.open(doubt.image_url, '_blank')}
              />
            </div>
          )}

          {/* Actions bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 14, borderTop: '1px solid var(--c-surface-2)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--c-text-2)' }}>
              <MessageSquare size={15} /> {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
            </span>
            {!isOwner && (
              <button onClick={() => setShowReport(!showReport)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1px solid var(--c-border)', background: 'var(--c-surface)', color: 'var(--c-text-3)', fontSize: '0.8rem', cursor: 'pointer' }}>
                <Flag size={13} /> Report
              </button>
            )}
            {(isOwner || isTeacher) && (
              <button onClick={handleDeleteDoubt} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1px solid var(--c-danger-border)', background: 'var(--c-danger-bg)', color: 'var(--c-danger)', fontSize: '0.8rem', cursor: 'pointer' }}>
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>

          {showReport && (
            <div style={{ marginTop: 14, padding: 16, background: 'var(--c-danger-bg)', borderRadius: 10, border: '1px solid var(--c-danger-border)' }}>
              <p style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-danger)' }}>Report this doubt</p>
              <textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Describe the issue..." className="input textarea" style={{ minHeight: 70 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={submitReport} className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '7px 16px' }}>Submit</button>
                <button onClick={() => setShowReport(false)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 16px' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Answers */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: 'var(--c-text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} /> {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          {answers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--c-surface)', borderRadius: 12, border: '1px solid var(--c-border)' }}>
              <MessageSquare size={36} color="var(--c-border)" style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, color: 'var(--c-text-3)', fontSize: '0.9rem' }}>
                {isTeacher ? 'No answers yet — be the first to help this student!' : 'No answers yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <div className="animate-slide-up">
              {answers.map(a => (
                <AnswerCard
                  key={a.id}
                  answer={a}
                  onUpvote={handleUpvoteAnswer}
                  onMarkBest={handleMarkBest}
                  canMarkBest={isOwner && doubt.status !== 'resolved'}
                  isBest={a.is_best_answer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Answer composer */}
        <AnswerComposer onSubmit={handleSubmitAnswer} isTeacher={isTeacher} />
      </div>
    </div>
  )
}
