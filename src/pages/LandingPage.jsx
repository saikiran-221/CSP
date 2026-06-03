import { Link } from 'react-router-dom'
import { BookOpen, Shield, Search, Users, Star, ArrowRight, CheckCircle, MessageSquare, Eye } from 'lucide-react'

const features = [
  { icon: Eye, title: 'Anonymous Posting', description: 'Ask doubts without revealing your identity. Feel confident and safe to ask anything.', color: '#6B7CC4' },
  { icon: Shield, title: 'Teacher Moderation', description: 'Subject-wise teachers review and answer doubts, keeping discussions academic and focused.', color: '#7BAE8F' },
  { icon: Search, title: 'Searchable Knowledge', description: 'Every solved doubt becomes a reusable resource. Search before asking to find existing answers.', color: '#5B8DB8' },
  { icon: Users, title: 'Collaborative Learning', description: 'Students upvote the best answers and help each other grow together.', color: '#A78BFA' },
]

const subjects = [
  { emoji: '⚛️', label: 'Physics' }, { emoji: '🧪', label: 'Chemistry' },
  { emoji: '🧬', label: 'Biology' }, { emoji: '📐', label: 'Mathematics' },
  { emoji: '📖', label: 'English' }, { emoji: '🇮🇳', label: 'Hindi' },
  { emoji: '🏛️', label: 'History' }, { emoji: '🌍', label: 'Geography' },
  { emoji: '⚖️', label: 'Civics' }, { emoji: '📊', label: 'Economics' },
  { emoji: '💻', label: 'Computer Science' }, { emoji: '🧾', label: 'Accountancy' },
]

const stats = [
  { number: '500+', label: 'Doubts Solved' },
  { number: '50+', label: 'Expert Teachers' },
  { number: '1200+', label: 'Students' },
  { number: '12', label: 'Subjects' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1D23 0%, #2D3748 50%, #1A1D23 100%)',
        padding: '80px 20px 100px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(107, 124, 196, 0.1)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(123, 174, 143, 0.1)', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107, 124, 196, 0.15)', border: '1px solid rgba(107, 124, 196, 0.3)', borderRadius: 999, padding: '6px 16px', marginBottom: 28 }}>
            <Star size={14} color="#A78BFA" fill="#A78BFA" />
            <span style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 500 }}>AI-Assisted Academic Collaboration Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, margin: '0 0 20px' }}>
            Ask Doubts{' '}
            <span style={{ background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Without Fear
            </span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#9CA3AF', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            A safe, anonymous platform where school students ask academic doubts and expert teachers provide clear, organized answers — subject by subject.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
              background: 'linear-gradient(135deg, #6B7CC4, #5B8DB8)',
              color: 'white', fontWeight: 600, fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(107, 124, 196, 0.4)',
              transition: 'all 0.2s',
            }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', fontWeight: 500, fontSize: '0.95rem',
              transition: 'all 0.2s',
            }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ maxWidth: 700, margin: '60px auto 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 8px' }}>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{s.number}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1A1D23', margin: '0 0 12px' }}>Why DoubtExchange?</h2>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>Built specifically for school students who want to learn without hesitation</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 600, color: '#1A1D23' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section style={{ padding: '60px 20px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1D23', margin: '0 0 10px' }}>All School Subjects Covered</h2>
          <p style={{ color: '#6B7280', marginBottom: 40 }}>Science, Commerce & Arts streams — all in one place</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {subjects.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: 10,
                fontSize: '0.875rem', fontWeight: 500, color: '#374151',
                transition: 'all 0.2s', cursor: 'default',
              }}>
                <span>{s.emoji}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1D23', textAlign: 'center', margin: '0 0 50px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {[
            { step: '01', title: 'Create Account', desc: 'Register as a student or teacher in under a minute.' },
            { step: '02', title: 'Post Your Doubt', desc: 'Type your question, pick a subject, and optionally go anonymous.' },
            { step: '03', title: 'Teacher Answers', desc: 'Subject teachers review and post clear, structured answers.' },
            { step: '04', title: 'Learn & Share', desc: 'Upvote helpful answers. Solved doubts help future students too.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', fontSize: '0.9rem', fontWeight: 800, color: 'white'
              }}>
                {item.step}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 600, color: '#1A1D23' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #6B7CC4, #5B8DB8, #7BAE8F)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 14px' }}>Ready to Clear Your Doubts?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 32px', fontSize: '1rem' }}>Join hundreds of students already learning confidently</p>
        <Link to="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 32px', borderRadius: 10, textDecoration: 'none',
          background: 'white', color: '#6B7CC4', fontWeight: 700, fontSize: '0.95rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          Join DoubtExchange <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1A1D23', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #6B7CC4, #7BAE8F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>DoubtExchange</span>
        </div>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.8rem' }}>© 2025 DoubtExchange. Empowering students to ask freely.</p>
      </footer>
    </div>
  )
}
