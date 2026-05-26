'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { isPast } from 'date-fns'

interface Event {
  id: string
  name: string
  date: string
  time: string | null
  description: string | null
  location: string | null
}

export function EventosClient({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState({ name: '', date: '', time: '', description: '', location: '' })
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', date: new Date().toISOString().split('T')[0], time: '', description: '', location: '' })
    setDialogOpen(true)
  }

  function openEdit(event: Event) {
    setEditing(event)
    setForm({
      name: event.name, date: event.date.split('T')[0],
      time: event.time || '', description: event.description || '', location: event.location || '',
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.date) return
    setSaving(true)
    try {
      const url = editing ? `/api/admin/events/${editing.id}` : '/api/admin/events'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        const updated = await res.json()
        const serialized = { ...updated, date: updated.date }
        if (editing) {
          setEvents(prev => prev.map(e => e.id === updated.id ? serialized : e).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
        } else {
          setEvents(prev => [...prev, serialized].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
        }
        setDialogOpen(false)
      }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este evento?')) return
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    if (res.ok) setEvents(prev => prev.filter(e => e.id !== id))
  }

  const upcoming = events.filter(e => !isPast(new Date(e.date)))
  const past = events.filter(e => isPast(new Date(e.date)))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-3xl text-navy">Eventos</h1>
          <p className="font-nunito text-gray-500 text-sm">{upcoming.length} próximos · {past.length} pasados</p>
        </div>
        <Button onClick={openCreate} className="bg-navy hover:bg-navy-dark text-white font-nunito">
          <Plus size={16} className="mr-1" />Nuevo evento
        </Button>
      </div>

      {/* Upcoming events */}
      <div>
        <h2 className="font-fredoka text-xl text-navy mb-3">Próximos eventos</h2>
        {upcoming.length === 0 && (
          <div className="text-center py-8 font-nunito text-gray-400 bg-white rounded-xl border border-gray-200">
            No hay eventos próximos programados.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map(event => (
            <EventCard key={event.id} event={event} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {past.length > 0 && (
        <div>
          <h2 className="font-fredoka text-xl text-gray-400 mb-3">Eventos pasados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {past.slice(0, 6).map(event => (
              <EventCard key={event.id} event={event} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-fredoka text-navy text-xl">
              {editing ? 'Editar evento' : 'Nuevo evento'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Nombre del evento *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Día de la familia..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Fecha *</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Hora</Label>
                <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Lugar</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Patio del jardín..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Descripción</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Detalles del evento..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.date} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                {saving ? 'Guardando...' : editing ? 'Guardar' : 'Crear evento'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EventCard({ event, onEdit, onDelete }: { event: Event; onEdit: (e: Event) => void; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-fredoka text-navy text-base mb-1">{event.name}</h3>
            <div className="flex flex-col gap-1">
              <div className="font-nunito text-xs text-gray-500">{formatDate(event.date, 'EEEE d MMMM yyyy')}</div>
              {event.time && (
                <div className="flex items-center gap-1 font-nunito text-xs text-gray-400">
                  <Clock size={10} />{event.time} hs
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1 font-nunito text-xs text-gray-400">
                  <MapPin size={10} />{event.location}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(event)} className="h-7 w-7 p-0">
            <Pencil size={12} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)} className="h-7 w-7 p-0 text-crimson hover:text-crimson">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
      {event.description && (
        <p className="font-nunito text-xs text-gray-600 mt-3 line-clamp-2">{event.description}</p>
      )}
    </div>
  )
}
