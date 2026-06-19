/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error && data) setProfile(data)
    } catch (e) {
      console.error('Profile fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function signUp({ email, password, name, role, subject }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role, subject: subject || null } }
    })
    if (error) throw error

    // Also upsert profile manually in case trigger doesn't fire immediately
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email,
        role,
        subject: subject || null,
      }, { onConflict: 'id' })
    }
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isStudent: profile?.role === 'student',
    isTeacher: profile?.role === 'teacher',
    isAdmin: profile?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
