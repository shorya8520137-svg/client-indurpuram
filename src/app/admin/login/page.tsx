'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo credentials — change these in production
    if (email === 'admin@wasidental.com' && password === 'admin123') {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl glass-card p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 mx-auto mb-4">
            <span className="text-accent text-2xl font-bold">W</span>
          </div>
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="text-sm text-foreground/50 mt-1">Wasi Dental Clinic</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-foreground/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wasidental.com"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-foreground/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-accent/5 border border-accent/10">
          <p className="text-[11px] text-foreground/50 text-center leading-relaxed">
            Demo credentials are shown in the input placeholders
          </p>
        </div>
      </div>
    </div>
  )
}
