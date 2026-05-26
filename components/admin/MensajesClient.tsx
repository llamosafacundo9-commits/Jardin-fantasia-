'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, MailOpen, Trash2, Reply } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export function MensajesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selected, setSelected] = useState<Message | null>(null)

  const unread = messages.filter(m => !m.read).length

  async function markRead(id: string, read: boolean) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    })
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, read } : null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este mensaje?')) return
    const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selected?.id === id) setSelected(null)
    }
  }

  function selectMessage(msg: Message) {
    setSelected(msg)
    if (!msg.read) markRead(msg.id, true)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-fredoka text-3xl text-navy">Mensajes</h1>
        <p className="font-nunito text-gray-500 text-sm">
          {messages.length} mensajes · {unread} sin leer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[calc(100vh-200px)]">
        {/* Message list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-16 font-nunito text-gray-400">
              No hay mensajes todavía.
            </div>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => selectMessage(msg)}
              className={cn(
                'flex items-start gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors',
                selected?.id === msg.id && 'bg-blue-50 border-l-2 border-l-navy',
                !msg.read && 'bg-blue-50/40'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {msg.read ? <MailOpen size={16} className="text-gray-400" /> : <Mail size={16} className="text-navy" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn('font-nunito text-sm', !msg.read ? 'font-bold text-navy' : 'font-semibold text-gray-700')}>
                    {msg.name}
                  </span>
                  <span className="font-nunito text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="font-nunito text-xs text-gray-500 truncate">{msg.email}</p>
                <p className="font-nunito text-xs text-gray-600 line-clamp-2 mt-0.5">{msg.message}</p>
              </div>
              {!msg.read && <div className="w-2 h-2 rounded-full bg-navy flex-shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>

        {/* Message detail */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400 font-nunito">
                <Mail size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Selecciona un mensaje para verlo</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-fredoka text-navy text-xl">{selected.name}</h3>
                    <p className="font-nunito text-sm text-gray-500">{selected.email}</p>
                    <p className="font-nunito text-xs text-gray-400 mt-1">{formatDate(selected.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => markRead(selected.id, !selected.read)} title="Marcar como leído/no leído">
                      {selected.read ? <Mail size={14} /> : <MailOpen size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(selected.id)} className="text-crimson hover:text-crimson">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-5 overflow-y-auto">
                <p className="font-nunito text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="p-4 border-t border-gray-100">
                <Button
                  asChild
                  className="bg-navy hover:bg-navy-dark text-white font-nunito w-full"
                >
                  <a href={`mailto:${selected.email}?subject=Re: Mensaje desde Centro Fantasía`}>
                    <Reply size={14} className="mr-2" />Responder por email
                  </a>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
