import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, GraduationCap, Presentation } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SUBJECTS } from '../lib/constants'
import { Logo } from '../components/Logo'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', subject: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (role === 'teacher' && !form.subject) return setError('Please select your subject')
    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, name: form.name, role, subject: form.subject || null })
      toast.success('Account created! Welcome to DoubtXchange 🎉')
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const label = (text) => (
    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: 'var(--c-text-2)', marginBottom: 6 }}>{text}</label>
  )

  return (
    <div className="auth-wrapper">
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <Logo size="lg" showText={false} />
          </div>
          <h1 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-text-1)' }}>Create your account</h1>
          <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.9rem' }}>Join DoubtXchange for free</p>
        </div>

        <div className="card auth-card" style={{ padding: 28 }}>
          {/* Role Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
            {[
              { value: 'student', label: 'Student', icon: GraduationCap },
              { value: 'teacher', label: 'Teacher', icon: Presentation },
            ].map(({ value, label: lbl, icon: Icon }) => {
              const isActive = role === value
              const activeClass = value === 'student' ? 'role-student-active' : 'role-teacher-active'
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`role-card ${isActive ? activeClass : 'role-card-inactive'}`}
                >
                  <Icon size={17} />
                  <span>{lbl}</span>
                </button>
              )
            })}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)', borderRadius: 9, padding: '10px 14px', marginBottom: 18 }}>
              <AlertCircle size={15} color="var(--c-danger)" />
              <span style={{ fontSize: '0.84rem', color: 'var(--c-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              {label('Full name')}
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="input" style={{ paddingLeft: 38 }} />
              </div>
            </div>

            <div>
              {label('Email address')}
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@school.edu" className="input" style={{ paddingLeft: 38 }} />
              </div>
            </div>

            {role === 'teacher' && (
              <div>
                {label('Your Subject')}
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input" required>
                  <option value="">Select your subject...</option>
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
            )}

            <div>
              {label('Password')}
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" className="input" style={{ paddingLeft: 38, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              {label('Confirm password')}
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type={showPw ? 'text' : 'password'} required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" className="input" style={{ paddingLeft: 38 }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 11, fontSize: '0.95rem', marginTop: 4 }}>
              {loading ? <><div className="spinner" /> Creating account...</> : `Create ${role === 'teacher' ? 'Teacher' : 'Student'} Account`}
            </button>
          </form>

          <p style={{ textAlign: 'center', margin: '16px 0 0', fontSize: '0.875rem', color: 'var(--c-text-2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--c-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
