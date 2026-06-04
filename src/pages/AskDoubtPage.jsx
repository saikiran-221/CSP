import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, EyeOff, Eye, AlertCircle, Send, ImagePlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SUBJECTS, containsBadWord } from '../lib/constants'
import { SubjectBadge } from '../components/UI'
import toast from 'react-hot-toast'

export default function AskDoubtPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', subject: '', is_anonymous: false })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async () => {
    if (!imageFile) return null
    const ext = imageFile.name.split('.').pop()
    const path = `doubts/${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('doubt-images').upload(path, imageFile)
    if (error) throw new Error('Image upload failed: ' + error.message)
    const { data } = supabase.storage.from('doubt-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.subject) return setError('Please select a subject')
    if (form.title.trim().length < 10) return setError('Title must be at least 10 characters')
    if (containsBadWord(form.title) || (form.description && containsBadWord(form.description))) {
      return setError('Your doubt contains inappropriate language. Please revise it.')
    }

    setLoading(true)
    try {
      const imageUrl = await uploadImage()
      const { data, error } = await supabase.from('doubts').insert({
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        is_anonymous: form.is_anonymous,
        image_url: imageUrl,
        status: 'open',
        upvotes: 0,
      }).select().single()

      if (error) throw error
      toast.success('Doubt posted successfully!')
      navigate(`/doubt/${data.id}`)
    } catch (err) {
      setError(err.message || 'Failed to post doubt. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = form.description.length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '28px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-text-1)' }}>Ask a Doubt</h1>
          <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.9rem' }}>Be specific — good questions get better answers faster</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)', borderRadius: 8, padding: '10px 14px', marginBottom: 22 }}>
              <AlertCircle size={16} color="var(--c-danger)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--c-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: 10 }}>Subject *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SUBJECTS.map(s => (
                  <button key={s.id} type="button" onClick={() => setForm({ ...form, subject: s.id })} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                    borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                    transition: 'all 0.15s',
                    borderColor: form.subject === s.id ? 'var(--c-accent)' : 'var(--c-border)',
                    background: form.subject === s.id ? 'var(--c-accent-bg)' : 'var(--c-surface)',
                    color: form.subject === s.id ? 'var(--c-accent)' : 'var(--c-text-2)',
                    transform: form.subject === s.id ? 'scale(1.02)' : 'scale(1)',
                  }}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: 6 }}>
                Doubt Title *
                <span style={{ fontWeight: 400, color: 'var(--c-text-3)', marginLeft: 8 }}>Be concise and specific</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Why does a convex lens form real image?"
                className="input"
                maxLength={200}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--c-text-3)', textAlign: 'right' }}>{form.title.length}/200</p>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: 6 }}>
                Detailed Description
                <span style={{ fontWeight: 400, color: 'var(--c-text-3)', marginLeft: 8 }}>(optional) — explain what you tried and where you're stuck</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="(Optional) Describe your doubt in more detail. Include what you already understand, what's confusing you, or any attempt you made..."
                className="input textarea"
                style={{ minHeight: 130 }}
                maxLength={2000}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: charCount > 1800 ? 'var(--c-danger)' : 'var(--c-text-3)', textAlign: 'right' }}>{charCount}/2000</p>
            </div>

            {/* Image Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text-1)', marginBottom: 8 }}>
                Attach Image <span style={{ fontWeight: 400, color: 'var(--c-text-3)' }}>(optional — for diagrams/textbook screenshots)</span>
              </label>
              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 10, border: '1px solid var(--c-border)' }} />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} style={{
                    position: 'absolute', top: 8, right: 8, width: 28, height: 28,
                    borderRadius: '50%', background: 'var(--c-danger)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={14} color="white" />
                  </button>
                </div>
              ) : (
                <label htmlFor="image-upload" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '30px 20px', borderRadius: 10, border: '2px dashed var(--c-text-3)',
                  cursor: 'pointer', background: 'var(--c-surface-2)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-accent)'; e.currentTarget.style.background = 'var(--c-accent-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-text-3)'; e.currentTarget.style.background = 'var(--c-surface-2)'; }}
                >
                  <ImagePlus size={28} color="var(--c-text-3)" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-2)', fontWeight: 500 }}>Click to upload image</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--c-text-3)' }}>PNG, JPG, GIF up to 5MB</p>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10, background: form.is_anonymous ? 'var(--c-sage-bg)' : 'var(--c-surface-2)', border: `1px solid ${form.is_anonymous ? '#BBF7D0' : 'var(--c-border)'}`, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {form.is_anonymous ? <EyeOff size={20} color="var(--c-success)" /> : <Eye size={20} color="var(--c-text-3)" />}
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-text-1)' }}>
                    {form.is_anonymous ? 'Posting anonymously' : 'Posting as yourself'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--c-text-3)' }}>
                    {form.is_anonymous ? 'Your name will be hidden publicly. Teachers can identify you if needed.' : `Visible as ${profile?.name}`}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setForm({ ...form, is_anonymous: !form.is_anonymous })} style={{
                width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: form.is_anonymous ? 'var(--c-success)' : 'var(--c-text-3)',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: form.is_anonymous ? 23 : 3,
                  width: 20, height: 20, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: 8, padding: '10px 24px' }}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'white' }} />
                    Posting...
                  </>
                ) : <><Send size={16} /> Post Doubt</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
