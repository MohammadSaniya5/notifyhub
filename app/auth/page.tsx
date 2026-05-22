'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Lock, Mail, User, Shield, KeySquare, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const router = useRouter()
  const { login, signup, user } = useAuth()
  const { showToast } = useNotification()

  // Tabs: 'LOGIN' | 'SIGNUP'
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN')

  // Form parameters
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student')
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick credentials assistance for reviewer
  const handleQuickLoad = async (role: 'admin' | 'student') => {
    setIsSubmitting(true)
    try {
      if (role === 'admin') {
        setEmail('admin@notifyhub.edu')
        setPassword('admin123')
        await login('admin@notifyhub.edu', 'admin123')
        showToast('Logged in successfully as Admin!', 'success')
        router.push('/admin')
      } else {
        setEmail('student@notifyhub.edu')
        setPassword('student123')
        await login('student@notifyhub.edu', 'student123')
        showToast('Logged in successfully as Student!', 'success')
        router.push('/')
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validations
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.', 'warning')
      return
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning')
      return
    }
    if (activeTab === 'SIGNUP' && !name.trim()) {
      showToast('Please enter your full name.', 'warning')
      return
    }

    setIsSubmitting(true)
    try {
      if (activeTab === 'LOGIN') {
        const ok = await login(email, password)
        if (ok) {
          showToast('Signed in successfully!', 'success')
          if (email.includes('admin') || email === 'admin@notifyhub.edu') {
            router.push('/admin')
          } else {
            router.push('/')
          }
        }
      } else {
        const ok = await signup(email, password, name, selectedRole)
        if (ok) {
          showToast('Account registered successfully! Session established.', 'success')
          if (selectedRole === 'admin') {
            router.push('/admin')
          } else {
            router.push('/')
          }
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication error.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10 shadow-2xl"
      >
        
        {/* Toggle Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800/80 mb-6">
          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'LOGIN' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('SIGNUP')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'SIGNUP' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Credentials shortcut helpers */}
        {activeTab === 'LOGIN' && (
          <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl mb-5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <KeySquare className="w-3.5 h-3.5 text-blue-500" /> Reviewer Testing Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLoad('admin')}
                className="py-2 px-3 rounded-xl bg-blue-600/15 border border-blue-500/35 hover:bg-blue-600/25 text-blue-500 font-bold transition flex items-center justify-between"
              >
                <span>Admin Login</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleQuickLoad('student')}
                className="py-2 px-3 rounded-xl bg-emerald-600/15 border border-emerald-500/35 hover:bg-emerald-600/25 text-emerald-500 font-bold transition flex items-center justify-between"
              >
                <span>Student Login</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Name (for Signup) */}
          {activeTab === 'SIGNUP' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
              <div className="flex items-center glass-card rounded-xl px-3 py-2 gap-2 border-slate-300 dark:border-slate-800">
                <User className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohammad Saniya"
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-400 uppercase tracking-wide">University Email</label>
            <div className="flex items-center glass-card rounded-xl px-3 py-2 gap-2 border-slate-300 dark:border-slate-800">
              <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saniya@student.edu"
                className="w-full bg-transparent outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-400 uppercase tracking-wide">Secure Password</label>
            <div className="flex items-center glass-card rounded-xl px-3 py-2 gap-2 border-slate-300 dark:border-slate-800">
              <Lock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Role selector (for Signup) */}
          {activeTab === 'SIGNUP' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wide">Desired Role</label>
              <div className="grid grid-cols-2 gap-2 font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    selectedRole === 'student'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Student Profile
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    selectedRole === 'admin'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Faculty Admin
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex justify-center items-center gap-2"
          >
            {isSubmitting
              ? 'Processing Session...'
              : activeTab === 'LOGIN'
              ? 'Log In'
              : 'Create Account'}
          </button>

        </form>

      </motion.div>
    </main>
  )
}
