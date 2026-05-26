'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  role: string
  photo: string | null
  bio: string | null
  sortOrder: number
}

export function EquipoClient({ initialStaff }: { initialStaff: StaffMember[] }) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [form, setForm] = useState({ name: '', role: '', bio: '', sortOrder: 0 })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', role: '', bio: '', sortOrder: staff.length })
    setPreviewUrl(null)
    if (fileRef.current) fileRef.current.value = ''
    setDialogOpen(true)
  }

  function openEdit(member: StaffMember) {
    setEditing(member)
    setForm({ name: member.name, role: member.role, bio: member.bio || '', sortOrder: member.sortOrder })
    setPreviewUrl(member.photo)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.role) return
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/staff/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setStaff(prev => prev.map(s => s.id === updated.id ? updated : s))
          setDialogOpen(false)
        }
      } else {
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('role', form.role)
        formData.append('bio', form.bio)
        formData.append('sortOrder', String(form.sortOrder))
        if (fileRef.current?.files?.[0]) formData.append('photo', fileRef.current.files[0])
        const res = await fetch('/api/admin/staff', { method: 'POST', body: formData })
        if (res.ok) {
          const member = await res.json()
          setStaff(prev => [...prev, member])
          setDialogOpen(false)
        }
      }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este miembro del equipo?')) return
    const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' })
    if (res.ok) setStaff(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-3xl text-navy">Equipo</h1>
          <p className="font-nunito text-gray-500 text-sm">{staff.length} integrantes</p>
        </div>
        <Button onClick={openCreate} className="bg-navy hover:bg-navy-dark text-white font-nunito">
          <Plus size={16} className="mr-1" />Agregar integrante
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-sm transition-shadow">
            <div className="relative w-20 h-20 mx-auto mb-3">
              {member.photo ? (
                <Image src={member.photo} alt={member.name} fill className="rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
                  <span className="font-fredoka text-white text-2xl">{member.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <h3 className="font-fredoka text-navy text-base">{member.name}</h3>
            <p className="font-nunito text-crimson text-xs font-semibold mb-2">{member.role}</p>
            {member.bio && <p className="font-nunito text-gray-500 text-xs line-clamp-3">{member.bio}</p>}
            <div className="flex justify-center gap-1 mt-3">
              <Button variant="ghost" size="sm" onClick={() => openEdit(member)} className="h-7">
                <Pencil size={12} className="mr-1" />Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} className="h-7 text-crimson hover:text-crimson">
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <div className="col-span-full text-center py-12 font-nunito text-gray-400 bg-white rounded-xl border border-gray-200">
            No hay integrantes del equipo registrados.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-fredoka text-navy text-xl">
              {editing ? 'Editar integrante' : 'Nuevo integrante'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            {!editing && (
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Foto</Label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-navy transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 py-2">
                      <Upload size={18} />
                      <span className="font-nunito text-xs">Subir foto</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) setPreviewUrl(URL.createObjectURL(f))
                }} />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Nombre *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Rol *</Label>
              <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Directora, Maestra..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Biografía breve</Label>
              <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Descripción breve..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.role} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                {saving ? 'Guardando...' : editing ? 'Guardar' : 'Agregar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
