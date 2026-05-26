'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Pin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface NewsPost {
  id: string
  title: string
  content: string
  publishDate: string
  pinned: boolean
  active: boolean
}

export function NoticiasClient({ initialNews }: { initialNews: NewsPost[] }) {
  const [news, setNews] = useState<NewsPost[]>(initialNews)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<NewsPost | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setTitle(''); setContent(''); setPublishDate(new Date().toISOString().split('T')[0])
    setPinned(false); setActive(true)
    setDialogOpen(true)
  }

  function openEdit(post: NewsPost) {
    setEditing(post)
    setTitle(post.title)
    setContent(post.content)
    setPublishDate(post.publishDate.split('T')[0])
    setPinned(post.pinned)
    setActive(post.active)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!title || !content) return
    setSaving(true)
    try {
      const body = { title, content, publishDate, pinned, active }
      const url = editing ? `/api/admin/news/${editing.id}` : '/api/admin/news'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) {
        const updated = await res.json()
        if (editing) {
          setNews(prev => prev.map(n => n.id === updated.id ? { ...updated, publishDate: updated.publishDate } : n))
        } else {
          setNews(prev => [{ ...updated, publishDate: updated.publishDate }, ...prev])
        }
        setDialogOpen(false)
      }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return
    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    if (res.ok) setNews(prev => prev.filter(n => n.id !== id))
  }

  async function togglePinned(post: NewsPost) {
    const res = await fetch(`/api/admin/news/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !post.pinned }),
    })
    if (res.ok) setNews(prev => prev.map(n => n.id === post.id ? { ...n, pinned: !n.pinned } : n))
  }

  async function toggleActive(post: NewsPost) {
    const res = await fetch(`/api/admin/news/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !post.active }),
    })
    if (res.ok) setNews(prev => prev.map(n => n.id === post.id ? { ...n, active: !n.active } : n))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-3xl text-navy">Noticias y Avisos</h1>
          <p className="font-nunito text-gray-500 text-sm">{news.length} publicaciones</p>
        </div>
        <Button onClick={openCreate} className="bg-navy hover:bg-navy-dark text-white font-nunito">
          <Plus size={16} className="mr-1" />Nueva noticia
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {news.length === 0 && (
          <div className="text-center py-16 font-nunito text-gray-400 bg-white rounded-xl border border-gray-200">
            No hay noticias. ¡Crea la primera!
          </div>
        )}
        {news.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-fredoka text-navy text-lg">{post.title}</h3>
                {post.pinned && <Badge variant="crimson" className="text-xs">Destacado</Badge>}
                {!post.active && <Badge variant="outline" className="text-xs">Inactivo</Badge>}
              </div>
              <div
                className="font-nunito text-sm text-gray-600 line-clamp-2 mb-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <span className="font-nunito text-xs text-gray-400">{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => togglePinned(post)} title={post.pinned ? 'Quitar destacado' : 'Destacar'}>
                <Pin size={14} className={post.pinned ? 'text-crimson' : 'text-gray-400'} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-crimson hover:text-crimson">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-fredoka text-navy text-xl">
              {editing ? 'Editar noticia' : 'Nueva noticia'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Título *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título de la noticia" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-nunito font-semibold text-xs">Contenido *</Label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Escribe el contenido de la noticia... (HTML básico permitido)"
                rows={6}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none font-nunito"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Fecha de publicación</Label>
                <Input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-4 justify-end pb-1">
                <div className="flex items-center gap-3">
                  <Switch checked={pinned} onCheckedChange={setPinned} />
                  <Label className="font-nunito text-sm">Destacado en inicio</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={active} onCheckedChange={setActive} />
                  <Label className="font-nunito text-sm">Publicado</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || !title || !content} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Publicar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
