'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, Trash2, Plus, X, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Photo {
  id: string
  title: string
  url: string
  category: string
  date: string
  sortOrder: number
}

const CATEGORIES = ['Salidas', 'Actividades', 'Eventos', 'Cotidiano']

export function AdminGaleriaClient({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Actividades')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleUpload() {
    if (!title || !category) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('date', date)
      if (fileRef.current?.files?.[0]) {
        formData.append('file', fileRef.current.files[0])
      }

      const res = await fetch('/api/admin/photos', { method: 'POST', body: formData })
      if (res.ok) {
        const photo = await res.json()
        setPhotos(prev => [...prev, { ...photo, date: photo.date }])
        setShowForm(false)
        setTitle('')
        setPreviewUrl(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    } finally { setUploading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return
    const res = await fetch(`/api/admin/photos/${id}`, { method: 'DELETE' })
    if (res.ok) setPhotos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-3xl text-navy">Galería</h1>
          <p className="font-nunito text-gray-500 text-sm">{photos.length} fotos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-navy hover:bg-navy-dark text-white font-nunito">
          <Plus size={16} className="mr-1" />Subir foto
        </Button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-fredoka text-navy text-xl mb-4">Nueva foto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Título *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Descripción de la foto" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Fecha</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Imagen</Label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-navy transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 py-4">
                    <Upload size={20} />
                    <span className="font-nunito text-xs">Click para seleccionar imagen</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleUpload} disabled={uploading || !title} className="bg-navy hover:bg-navy-dark text-white font-nunito">
              {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo...</> : 'Subir foto'}
            </Button>
          </div>
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <Image src={photo.url} alt={photo.title} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-3">
              <p className="font-nunito text-xs font-semibold text-navy line-clamp-1">{photo.title}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="navy" className="text-xs">{photo.category}</Badge>
                <span className="font-nunito text-xs text-gray-400">{formatDate(photo.date)}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full text-center py-16 font-nunito text-gray-400">
            No hay fotos. ¡Sube la primera!
          </div>
        )}
      </div>
    </div>
  )
}
