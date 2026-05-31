'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useJobStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/jobs', label: 'Jobs' },
  ]

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <span className="font-semibold text-neutral-900 tracking-tight">JobTrack</span>
          </Link>
          <div className="flex items-center gap-1">
            {links.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500 hidden sm:block">{user?.name}</span>
          <button onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-50">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
