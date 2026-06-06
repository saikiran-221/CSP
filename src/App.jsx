import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import AskDoubtPage from './pages/AskDoubtPage'
import MyDoubtsPage from './pages/MyDoubtsPage'
import DoubtDetailPage from './pages/DoubtDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import TeacherDashboard from './pages/TeacherDashboard'
import ModerationPanel from './pages/ModerationPanel'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #E5E7EB', borderTopColor: '#6B7CC4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>Loading DoubtExchange...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={
          !user ? <LandingPage /> :
          !profile ? null :
          <Navigate to={profile.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />
        } />
        <Route path="/login" element={
          !user ? <LoginPage /> :
          !profile ? null :
          <Navigate to={profile.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />
        } />
        <Route path="/register" element={
          !user ? <RegisterPage /> :
          !profile ? null :
          <Navigate to={profile.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />
        } />

        {/* Shared */}
        <Route path="/doubt/:id" element={<ProtectedRoute><DoubtDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Student routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/ask" element={<ProtectedRoute allowedRoles={['student']}><AskDoubtPage /></ProtectedRoute>} />
        <Route path="/student/my-doubts" element={<ProtectedRoute allowedRoles={['student']}><MyDoubtsPage /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student']}><NotificationsPage /></ProtectedRoute>} />

        {/* Teacher routes */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/moderation" element={<ProtectedRoute allowedRoles={['teacher']}><ModerationPanel /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '80px 20px' }}><h2>Page not found</h2><a href="/">Go home</a></div>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                borderRadius: '10px',
                background: 'var(--c-surface)',
                color: 'var(--c-text-1)',
                border: '1px solid var(--c-border)',
                boxShadow: 'var(--shadow-soft)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
