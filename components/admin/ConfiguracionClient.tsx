'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Loader2 } from 'lucide-react'

interface ConfiguracionClientProps {
  settings: Record<string, string>
}

export function ConfiguracionClient({ settings }: ConfiguracionClientProps) {
  const [form, setForm] = useState({
    phone: settings.phone || '',
    address: settings.address || '',
    description: settings.description || '',
    facebook: settings.facebook || '',
    instagram: settings.instagram || '',
    mec: settings.mec || '',
  })
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [settingsOk, setSettingsOk] = useState(false)
  const [passwordOk, setPasswordOk] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  async function saveSettings() {
    setSavingSettings(true)
    setSettingsOk(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSettingsOk(true); setTimeout(() => setSettingsOk(false), 3000) }
    } finally { setSavingSettings(false) }
  }

  async function changePassword() {
    setPasswordError('')
    if (password.newPass !== password.confirm) { setPasswordError('Las contraseñas no coinciden'); return }
    if (password.newPass.length < 8) { setPasswordError('Mínimo 8 caracteres'); return }
    setSavingPassword(true)
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: password.current, newPassword: password.newPass }),
      })
      if (res.ok) {
        setPasswordOk(true)
        setPassword({ current: '', newPass: '', confirm: '' })
        setTimeout(() => setPasswordOk(false), 3000)
      } else {
        const data = await res.json()
        setPasswordError(data.error || 'Error al cambiar la contraseña')
      }
    } finally { setSavingPassword(false) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-fredoka text-3xl text-navy">Configuración</h1>
        <p className="font-nunito text-gray-500 text-sm">Ajustes del sitio y cuenta de administrador</p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info" className="font-nunito">Información del centro</TabsTrigger>
          <TabsTrigger value="password" className="font-nunito">Cambiar contraseña</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="font-fredoka text-navy text-xl">Datos del centro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Teléfono</Label>
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="099 000 000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Autorización MEC</Label>
                  <Input value={form.mec} onChange={e => setForm(f => ({ ...f, mec: e.target.value }))} placeholder="MEC Nº 996" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Dirección</Label>
                  <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Dirección completa" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Descripción del centro</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Facebook URL</Label>
                  <Input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="https://facebook.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="font-nunito font-semibold text-xs">Instagram URL</Label>
                  <Input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={saveSettings} disabled={savingSettings} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                  {savingSettings ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Guardar cambios'}
                </Button>
                {settingsOk && (
                  <div className="flex items-center gap-1.5 text-green-600 font-nunito text-sm">
                    <CheckCircle size={16} />¡Guardado!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="font-fredoka text-navy text-xl">Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Contraseña actual</Label>
                <Input type="password" value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Nueva contraseña</Label>
                <Input type="password" value={password.newPass} onChange={e => setPassword(p => ({ ...p, newPass: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-nunito font-semibold text-xs">Confirmar nueva contraseña</Label>
                <Input type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} />
              </div>
              {passwordError && <p className="text-crimson text-xs font-nunito">{passwordError}</p>}
              <div className="flex items-center gap-3">
                <Button onClick={changePassword} disabled={savingPassword || !password.current || !password.newPass} className="bg-navy hover:bg-navy-dark text-white font-nunito">
                  {savingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cambiando...</> : 'Cambiar contraseña'}
                </Button>
                {passwordOk && (
                  <div className="flex items-center gap-1.5 text-green-600 font-nunito text-sm">
                    <CheckCircle size={16} />¡Contraseña cambiada!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
