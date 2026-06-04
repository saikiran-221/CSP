import { Link } from 'react-router-dom'
import { Shield, Search, Users, Star, ArrowRight, Eye } from 'lucide-react'
import { Logo } from '../components/Logo'

const features = [
  { icon: Eye,    title: 'Anonymous Posting',    description: 'Ask doubts without revealing your identity. Feel confident and safe.', color: 'var(--c-accent)' },
  { icon: Shield, title: 'Teacher Moderation',   description: 'Subject-wise teachers review and answer doubts, keeping discussions academic.', color: 'var(--c-sage)' },
  { icon: Search, title: 'Searchable Knowledge', description: 'Every solved doubt becomes a reusable resource. Search before asking.', color: 'var(--c-accent-2)' },
  { icon: Users,  title: 'Collaborative Learning', description: 'Students upvote the best answers and help each other grow together.', color: '#A78BFA' },
]

const subjects = [
  { emoji: '⚛️', label: 'Physics' },    { emoji: '🧪', label: 'Chemistry' },
  { emoji: '🧬', label: 'Biology' },    { emoji: '📐', label: 'Mathematics' },
  { emoji: '📖', label: 'English' },    { emoji: '🇮🇳', label: 'Hindi' },
  { emoji: '🏛️', label: 'History' },   { emoji: '🌍', label: 'Geography' },
  { emoji: '⚖️', label: 'Civics' },    { emoji: '📊', label: 'Economics' },
  { emoji: '💻', label: 'Computer Science' }, { emoji: '🧾', label: 'Accountancy' },
]

const stats = [
  { number: '500+', label: 'Doubts Solved' },
  { number: '50+',  label: 'Expert Teachers' },
  { number: '1200+',label: 'Students' },
  { number: '12',   label: 'Subjects' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0D0F17 0%, #151A2E 50%, #0D0F17 100%)',
        padding: 'clamp(60px,10vw,100px) 20px clamp(70px,12vw,120px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: -120, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(107,124,196,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(123,174,143,0.10)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(107,124,196,0.12)', border: '1px solid rgba(107,124,196,0.25)', borderRadius: 999, padding: '6px 16px', marginBottom: 32 }}>
            <Star size={13} color="#A78BFA" fill="#A78BFA" />
            <span style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 500 }}>AI-Assisted Anonymous Academic Platform</span>
          </div>

          {/* Brand logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <Logo size="lg" showText={true} />
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.6rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Ask Doubts{' '}
            <span style={{ background: 'linear-gradient(135deg, #818CF8, #6DB88A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Without Fear
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#8B93BA', lineHeight: 1.75, margin: '0 0 40px', maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
            A safe, anonymous platform where school students ask academic doubts and expert teachers provide clear, organized answers — subject by subject.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
              background: 'linear-gradient(135deg, #6B7CC4, #5B8DB8)',
              color: 'white', fontWeight: 600, fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(107,124,196,0.45)', transition: 'all 0.2s',
            }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
              color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.95rem',
            }}>
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div style={{ maxWidth: 640, margin: '56px auto 0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '14px 8px' }}>
                <p style={{ margin: 0, fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, color: 'white' }}>{s.number}</p>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#555D80' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(50px,8vw,80px) 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 700, color: 'var(--c-text-1)', margin: '0 0 12px' }}>Why DoubtXchange?</h2>
          <p style={{ color: 'var(--c-text-2)', fontSize: '0.95rem' }}>Built specifically for school students who want to learn without hesitation</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: 26 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--c-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={21} color={f.color} />
              </div>
              <h3 style={{ margin: '0 0 9px', fontSize: '0.975rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--c-text-2)', lineHeight: 1.65 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subjects ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 20px', background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,1.75rem)', fontWeight: 700, color: 'var(--c-text-1)', margin: '0 0 8px' }}>All School Subjects Covered</h2>
          <p style={{ color: 'var(--c-text-2)', marginBottom: 36, fontSize: '0.9rem' }}>Science, Commerce & Arts streams — all in one place</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {subjects.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
                background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', borderRadius: 9,
                fontSize: '0.85rem', fontWeight: 500, color: 'var(--c-text-2)',
              }}>
                <span>{s.emoji}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(50px,8vw,80px) 20px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,1.75rem)', fontWeight: 700, color: 'var(--c-text-1)', textAlign: 'center', margin: '0 0 50px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {[
            { step: '01', title: 'Create Account', desc: 'Register as a student or teacher in under a minute.' },
            { step: '02', title: 'Post Your Doubt', desc: 'Type your question, pick a subject, and optionally go anonymous.' },
            { step: '03', title: 'Teacher Answers', desc: 'Subject teachers post clear answers with text, photos or videos.' },
            { step: '04', title: 'Learn & Share',   desc: 'Upvote helpful answers. Solved doubts help future students too.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: 'linear-gradient(135deg, var(--c-accent), var(--c-sage))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', fontSize: '0.88rem', fontWeight: 800, color: 'white',
              }}>{item.step}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--c-text-1)' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--c-text-2)', lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(50px,8vw,70px) 20px', background: 'linear-gradient(135deg, #6B7CC4, #5B8DB8, #7BAE8F)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 700, color: 'white', margin: '0 0 12px' }}>Ready to Clear Your Doubts?</h2>
        <p style={{ color: 'rgba(255,255,255,0.82)', margin: '0 0 32px', fontSize: '1rem' }}>Join hundreds of students already learning confidently</p>
        <Link to="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
          background: 'white', color: '#6B7CC4', fontWeight: 700, fontSize: '0.95rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          Join DoubtXchange <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ background: '#0A0C14', padding: '28px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Logo size="sm" showText={true} />
        </div>
        <p style={{ margin: 0, color: '#555D80', fontSize: '0.78rem' }}>© 2025 DoubtXchange · Empowering students to ask freely.</p>
      </footer>
    </div>
  )
}
