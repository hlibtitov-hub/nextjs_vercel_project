'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useJobStore'

export default function LoginPage() {
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) router.push('/dashboard')
    else setError('Invalid email or password')
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">J</span>
            </div>
            <span className="text-xl font-semibold text-neutral-900">JobTrack</span>
          </div>
          <p className="text-neutral-500 text-sm">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="password" required />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-neutral-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-xs text-neutral-400 text-center mt-4">Demo: alex@example.com / password</p>
        </div>
        <p className="text-center text-sm text-neutral-500 mt-4">
          No account? <Link href="/register" className="text-neutral-900 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
