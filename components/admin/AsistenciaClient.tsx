'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AttendanceStatus = 'present' | 'absent' | 'justified'

interface Child { id: string; firstName: string; lastName: string; ageGroup: string; sala: string | null }
interface AttendanceRecord { id: string; childId: string; status: AttendanceStatus; note: string | null }

const STATUS_CONFIG = {
  present: { label: 'Presente', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', selectedColor: 'bg-green-500 text-white' },
  absent: { label: 'Ausente', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', selectedColor: 'bg-red-500 text-white' },
  justified: { label: 'Justificado', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', selectedColor: 'bg-yellow-500 text-white' },
}

export function AsistenciaClient() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [children, setChildren] = useState<Child[]>([])
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [selectedDate])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/attendance?date=${selectedDate}`)
      if (res.ok) {
        const data = await res.json()
        setChildren(data.children)
        setAttendanceMap(data.attendanceMap)
      }
    } finally { setLoading(false) }
  }

  async function markAttendance(childId: string, status: AttendanceStatus) {
    setSaving(childId)
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, date: selectedDate, status }),
      })
      if (res.ok) {
        const record = await res.json()
        setAttendanceMap(prev => ({ ...prev, [childId]: record }))
      }
    } finally { setSaving(null) }
  }

  function changeDate(delta: number) {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelectedDate(format(d, 'yyyy-MM-dd'))
  }

  const stats = {
    present: Object.values(attendanceMap).filter(a => a.status === 'present').length,
    absent: Object.values(attendanceMap).filter(a => a.status === 'absent').length,
    justified: Object.values(attendanceMap).filter(a => a.status === 'justified').length,
    unmarked: children.length - Object.keys(attendanceMap).length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-fredoka text-3xl text-navy">Asistencia</h1>
        <p className="font-nunito text-gray-500 text-sm">Registrar asistencia diaria</p>
      </div>

      {/* Date selector */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 w-fit">
        <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}><ChevronLeft size={16} /></Button>
        <div className="text-center min-w-[160px]">
          <p className="font-fredoka text-navy text-lg capitalize">
            {format(new Date(selectedDate + 'T12:00:00'), 'EEEE', { locale: es })}
          </p>
          <p className="font-nunito text-gray-500 text-sm">
            {format(new Date(selectedDate + 'T12:00:00'), 'd MMMM yyyy', { locale: es })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => changeDate(1)}><ChevronRight size={16} /></Button>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 font-nunito"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Presentes', value: stats.present, color: 'text-green-600' },
          { label: 'Ausentes', value: stats.absent, color: 'text-red-600' },
          { label: 'Justificados', value: stats.justified, color: 'text-yellow-600' },
          { label: 'Sin marcar', value: stats.unmarked, color: 'text-gray-500' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`font-fredoka text-2xl ${s.color}`}>{s.value}</p>
              <p className="font-nunito text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-navy" size={28} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {children.length === 0 ? (
            <div className="text-center py-12 font-nunito text-gray-400">No hay niños activos registrados.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {children.map(child => {
                const record = attendanceMap[child.id]
                const isSaving = saving === child.id
                return (
                  <div key={child.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="font-nunito font-semibold text-navy text-sm">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="font-nunito text-xs text-gray-400">{child.ageGroup} años{child.sala ? ` · ${child.sala}` : ''}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map(status => {
                        const cfg = STATUS_CONFIG[status]
                        const active = record?.status === status
                        return (
                          <button
                            key={status}
                            onClick={() => markAttendance(child.id, status)}
                            disabled={isSaving}
                            className={cn(
                              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-nunito font-semibold transition-all',
                              active ? cfg.selectedColor + ' border-transparent' : cfg.color + ' hover:opacity-80'
                            )}
                          >
                            <cfg.icon size={12} />
                            <span className="hidden sm:inline">{cfg.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
