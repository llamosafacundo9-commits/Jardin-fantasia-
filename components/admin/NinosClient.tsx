'use client'
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Pencil, UserX, Download } from 'lucide-react'
import { calculateAge, formatDate, getAgeGroupLabel, exportToCSV } from '@/lib/utils'
import { differenceInYears } from 'date-fns'

const schema = z.object({
  firstName: z.string().min(1, 'Requerido'),
  lastName: z.string().min(1, 'Requerido'),
  dateOfBirth: z.string().min(1, 'Requerido'),
  ageGroup: z.string().min(1, 'Requerido'),
  sala: z.string().optional(),
  parentName: z.string().min(1, 'Requerido'),
  parentPhone: z.string().min(1, 'Requerido'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
  allergies: z.string().optional(),
  medicalInfo: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type FormData = z.infer<typeof schema>

interface Child {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ageGroup: string
  sala: string | null
  parentName: string
  parentPhone: string
  parentEmail: string | null
  enrollmentDate: string
  status: string
  notes: string | null
  allergies: string | null
  medicalInfo: string | null
}

export function NinosClient({ initialChildren }: { initialChildren: Child[] }) {
  const [children, setChildren] = useState<Child[]>(initialChildren)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterStatus, setFilterStatus] = useState('active')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active' },
  })

  const filtered = useMemo(() => children.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.parentName.toLowerCase().includes(q)
    const matchGroup = filterGroup === 'all' || c.ageGroup === filterGroup
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchGroup && matchStatus
  }), [children, search, filterGroup, filterStatus])

  function openCreate() {
    setEditingChild(null)
    reset({ status: 'active', firstName: '', lastName: '', dateOfBirth: '', ageGroup: '', sala: '', parentName: '', parentPhone: '', parentEmail: '', notes: '', allergies: '', medicalInfo: '' })
    setDialogOpen(true)
  }

  function openEdit(child: Child) {
    setEditingChild(child)
    reset({
      firstName: child.firstName, lastName: child.lastName,
      dateOfBirth: child.dateOfBirth.split('T')[0],
      ageGroup: child.ageGroup, sala: child.sala || '',
      parentName: child.parentName, parentPhone: child.parentPhone,
      parentEmail: child.parentEmail || '', notes: child.notes || '',
      allergies: child.allergies || '', medicalInfo: child.medicalInfo || '',
      status: child.status as 'active' | 'inactive',
    })
    setDialogOpen(true)
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const url = editingChild ? `/api/admin/children/${editingChild.id}` : '/api/admin/children'
      const method = editingChild ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const updated = await res.json()
        if (editingChild) {
          setChildren(prev => prev.map(c => c.id === updated.id ? updated : c))
        } else {
          setChildren(prev => [...prev, updated])
        }
        setDialogOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  async function deactivate(id: string) {
    if (!confirm('¿Desactivar este niño?')) return
    const res = await fetch(`/api/admin/children/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'inactive' }),
    })
    if (res.ok) setChildren(prev => prev.map(c => c.id === id ? { ...c, status: 'inactive' } : c))
  }

  function handleExport() {
    exportToCSV(filtered.map(c => ({
      Nombre: `${c.firstName} ${c.lastName}`,
      'Fecha de nacimiento': formatDate(c.dateOfBirth),
      Edad: differenceInYears(new Date(), new Date(c.dateOfBirth)),
      Grupo: c.ageGroup,
      Sala: c.sala || '',
      Tutor: c.parentName,
      Teléfono: c.parentPhone,
      Email: c.parentEmail || '',
      Estado: c.status === 'active' ? 'Activo' : 'Inactivo',
      'Fecha matriculación': formatDate(c.enrollmentDate),
    })), 'ninos-fantasia.csv')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-3xl text-navy">Niños</h1>
          <p className="font-nunito text-gray-500 text-sm">{filtered.length} registros</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="font-nunito">
            <Download size={14} className="mr-1" />CSV
          </Button>
          <Button onClick={openCreate} className="bg-navy hover:bg-navy-dark text-white font-nunito">
            <Plus size={16} className="mr-1" />Agregar niño
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o tutor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 font-nunito text-sm"
          />
        </div>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-48 h-9 font-nunito text-sm">
            <SelectValue placeholder="Grupo etario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            <SelectItem value="2-3">2-3 años</SelectItem>
            <SelectItem value="3-4">3-4 años</SelectItem>
            <SelectItem value="4-5">4-5 años</SelectItem>
            <SelectItem value="5-6">5-6 años</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9 font-nunito text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-fredoka text-navy">Nombre</TableHead>
              <TableHead className="font-fredoka text-navy">Edad</TableHead>
              <TableHead className="font-fredoka text-navy">Grupo</TableHead>
              <TableHead className="font-fredoka text-navy">Tutor</TableHead>
              <TableHead className="font-fredoka text-navy">Teléfono</TableHead>
              <TableHead className="font-fredoka text-navy">Estado</TableHead>
              <TableHead className="font-fredoka text-navy text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center font-nunito text-gray-400 py-12">
                  No se encontraron registros.
                </TableCell>
              </TableRow>
            )}
            {filtered.map(child => (
              <TableRow key={child.id} className="hover:bg-gray-50">
                <TableCell className="font-nunito font-semibold text-navy">
                  {child.firstName} {child.lastName}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {differenceInYears(new Date(), new Date(child.dateOfBirth))} años
                </TableCell>
                <TableCell>
                  <Badge variant="navy" className="text-xs font-nunito">{child.ageGroup} años</Badge>
                </TableCell>
                <TableCell className="font-nunito text-sm">{child.parentName}</TableCell>
                <TableCell className="font-nunito text-sm">{child.parentPhone}</TableCell>
                <TableCell>
                  <Badge variant={child.status === 'active' ? 'success' : 'outline'} className="font-nunito text-xs">
                    {child.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(child)} className="h-8 w-8 p-0">
                      <Pencil size={13} />
                    </Button>
                    {child.status === 'active' && (
                      <Button variant="ghost" size="sm" onClick={() => deactivate(child.id)} className="h-8 w-8 p-0 text-crimson hover:text-crimson">
                        <UserX size={13} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-fredoka text-navy text-xl">
              {editingChild ? 'Editar niño' : 'Agregar nuevo niño'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Nombre *</Label>
              <Input {...register('firstName')} placeholder="Nombre" />
              {errors.firstName && <p className="text-crimson text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Apellido *</Label>
              <Input {...register('lastName')} placeholder="Apellido" />
              {errors.lastName && <p className="text-crimson text-xs">{errors.lastName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Fecha de nacimiento *</Label>
              <Input type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && <p className="text-crimson text-xs">{errors.dateOfBirth.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Grupo etario *</Label>
              <Select onValueChange={v => setValue('ageGroup', v)} defaultValue={editingChild?.ageGroup}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3">2-3 años</SelectItem>
                  <SelectItem value="3-4">3-4 años</SelectItem>
                  <SelectItem value="4-5">4-5 años</SelectItem>
                  <SelectItem value="5-6">5-6 años</SelectItem>
                </SelectContent>
              </Select>
              {errors.ageGroup && <p className="text-crimson text-xs">{errors.ageGroup.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Sala</Label>
              <Input {...register('sala')} placeholder="Sala Verde, Sala Azul..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Estado</Label>
              <Select onValueChange={v => setValue('status', v as 'active' | 'inactive')} defaultValue={editingChild?.status || 'active'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Nombre del tutor *</Label>
              <Input {...register('parentName')} placeholder="Nombre del tutor" />
              {errors.parentName && <p className="text-crimson text-xs">{errors.parentName.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Teléfono del tutor *</Label>
              <Input {...register('parentPhone')} placeholder="099 000 000" />
              {errors.parentPhone && <p className="text-crimson text-xs">{errors.parentPhone.message}</p>}
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Email del tutor</Label>
              <Input type="email" {...register('parentEmail')} placeholder="email@ejemplo.com" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Alergias</Label>
              <Input {...register('allergies')} placeholder="Ninguna, mariscos, etc." />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Información médica</Label>
              <Textarea {...register('medicalInfo')} placeholder="Condiciones de salud relevantes..." rows={2} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Observaciones</Label>
              <Textarea {...register('notes')} placeholder="Notas adicionales..." rows={2} />
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                {loading ? 'Guardando...' : editingChild ? 'Guardar cambios' : 'Agregar niño'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
