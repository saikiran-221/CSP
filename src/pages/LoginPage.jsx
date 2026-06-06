import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await signIn(form)
      const signedInUser = data?.user
      toast.success('Welcome back!')
      if (signedInUser) {
        const { data: profileData } = await supabase.from('profiles').select('role').eq('id', signedInUser.id).single()
        const role = profileData?.role || 'student'
        if (from && from !== '/login' && from !== '/register') {
          navigate(from, { replace: true })
        } else {
          navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <Logo size="lg" showText={false} />
          </div>
          <h1 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-text-1)' }}>Welcome back</h1>
          <p style={{ margin: 0, color: 'var(--c-text-2)', fontSize: '0.9rem' }}>Sign in to DoubtXchange</p>
        </div>

        <div className="card auth-card" style={{ padding: 30 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--c-danger-bg)', border: '1px solid var(--c-danger-border)', borderRadius: 9, padding: '10px 14px', marginBottom: 18 }}>
              <AlertCircle size={15} color="var(--c-danger)" />
              <span style={{ fontSize: '0.84rem', color: 'var(--c-danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: 'var(--c-text-2)', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@school.edu" className="input" style={{ paddingLeft: 38 }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: 'var(--c-text-2)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)' }} />
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input" style={{ paddingLeft: 38, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 11, fontSize: '0.95rem', marginTop: 4 }}>
              {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', margin: '18px 0 0', fontSize: '0.875rem', color: 'var(--c-text-2)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--c-accent)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
