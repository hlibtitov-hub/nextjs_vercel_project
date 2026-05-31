import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Job, JobStatus, User } from '@/types'

const API = process.env.NEXT_PUBLIC_API_URL

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

interface JobState {
  jobs: Job[]
  isLoading: boolean
  searchQuery: string
  statusFilter: JobStatus | 'all'
  fetchJobs: (token: string) => Promise<void>
  addJob: (job: Omit<Job, 'id' | 'createdAt'>, token: string) => Promise<void>
  updateJob: (id: string, updates: Partial<Job>, token: string) => Promise<void>
  deleteJob: (id: string, token: string) => Promise<void>
  setSearch: (q: string) => void
  setFilter: (s: JobStatus | 'all') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const res = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (!res.ok) return false
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return true
        } catch {
          return false
        }
      },
      register: async (name, email, password) => {
        try {
          const res = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })
          const data = await res.json()
          if (!res.ok) return false
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return true
        } catch {
          return false
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)

export const useJobStore = create<JobState>()(
  (set, get) => ({
    jobs: [],
    isLoading: false,
    searchQuery: '',
    statusFilter: 'all',
    fetchJobs: async (token) => {
      set({ isLoading: true })
      try {
        const res = await fetch(`${API}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const jobs = data.jobs.map((j: any) => ({ ...j, id: j._id, createdAt: j.createdAt?.split('T')[0] }))
        set({ jobs, isLoading: false })
      } catch {
        set({ isLoading: false })
      }
    },
    addJob: async (job, token) => {
      const res = await fetch(`${API}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(job),
      })
      const data = await res.json()
      const newJob = { ...data.job, id: data.job._id, createdAt: data.job.createdAt?.split('T')[0] }
      set({ jobs: [newJob, ...get().jobs] })
    },
    updateJob: async (id, updates, token) => {
      const res = await fetch(`${API}/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      const updated = { ...data.job, id: data.job._id, createdAt: data.job.createdAt?.split('T')[0] }
      set({ jobs: get().jobs.map((j) => (j.id === id ? updated : j)) })
    },
    deleteJob: async (id, token) => {
      await fetch(`${API}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ jobs: get().jobs.filter((j) => j.id !== id) })
    },
    setSearch: (searchQuery) => set({ searchQuery }),
    setFilter: (statusFilter) => set({ statusFilter }),
  })
)
