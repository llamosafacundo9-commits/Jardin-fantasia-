'use client'
import { useSession } from 'next-auth/react'
import { Bell, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="font-fredoka text-navy text-lg">Panel de Administración</h2>
        <p className="font-nunito text-gray-500 text-xs">Centro de Educación Inicial Fantasía</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy transition-colors font-nunito"
        >
          <ExternalLink size={12} />
          Ver sitio
        </Link>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
            <span className="font-fredoka text-white text-sm">
              {session?.user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <span className="font-nunito text-sm text-gray-700 hidden sm:block">
            {session?.user?.name || session?.user?.email}
          </span>
        </div>
      </div>
    </header>
  )
}
