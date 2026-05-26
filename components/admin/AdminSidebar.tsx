'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CalendarCheck, Image, Newspaper,
  Calendar, UserSquare, MessageSquare, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { NavbarLogo } from '@/components/public/CastleLogo'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/ninos', icon: Users, label: 'Niños' },
  { href: '/admin/asistencia', icon: CalendarCheck, label: 'Asistencia' },
  { href: '/admin/galeria', icon: Image, label: 'Galería' },
  { href: '/admin/noticias', icon: Newspaper, label: 'Noticias' },
  { href: '/admin/eventos', icon: Calendar, label: 'Eventos' },
  { href: '/admin/equipo', icon: UserSquare, label: 'Equipo' },
  { href: '/admin/mensajes', icon: MessageSquare, label: 'Mensajes' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'bg-[#1A1C6B] flex flex-col transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <NavbarLogo />
            <span className="font-fredoka text-white text-sm leading-tight">
              Admin<br />Fantasía
            </span>
          </div>
        )}
        {collapsed && <NavbarLogo />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/60 hover:text-white transition-colors p-1 rounded"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-nunito text-sm',
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all font-nunito text-sm"
          title={collapsed ? 'Salir' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </aside>
  )
}
