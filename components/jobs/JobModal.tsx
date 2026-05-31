'use client'
import { useState, useEffect } from 'react'
import { Job, JobStatus } from '@/types'
import { useJobStore } from '@/store/useJobStore'

interface Props {
  job?: Job | null
  onClose: () => void
  token: string
}

const STATUSES: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected']

const empty = {
  company: '', role: '', status: 'Applied' as JobStatus,
  location: '', salary: '', url: '', notes: '',
}

export default function JobModal({ job, onClose, token }: Props) {
  const { addJob, updateJob } = useJobStore()
  const [form, setForm] = useState(job ? {
    company: job.company, role: job.role, status: job.status,
    location: job.location, salary: job.salary, url: job.url, notes: job.notes,
  } : empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (job) await updateJob(job.id, form, token)
    else await addJob(form, token)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">{job ? 'Edit Job' : 'Add Job'}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 text-xl leading-none">x</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Company *</label>
              <input value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="Google" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Role *</label>
              <input value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="Frontend Engineer" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="Remote" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Salary</label>
              <input value={form.salary} onChange={e => set('salary', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="$100k" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Job URL</label>
              <input value={form.url} onChange={e => set('url', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="https://..." type="url" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-none"
              rows={3} placeholder="Interview notes..." />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {job ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
