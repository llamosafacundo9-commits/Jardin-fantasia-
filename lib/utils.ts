import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInYears, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateOfBirth: Date): number {
  return differenceInYears(new Date(), dateOfBirth)
}

export function formatDate(date: Date | string, fmt = 'dd/MM/yyyy'): string {
  return format(new Date(date), fmt, { locale: es })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(amount)
}

export function getAgeGroupLabel(group: string): string {
  const labels: Record<string, string> = {
    '2-3': 'Sala Amarilla (2-3 años)',
    '3-4': 'Sala Azul (3-4 años)',
    '4-5': 'Sala Verde (4-5 años)',
    '5-6': 'Sala Roja (5-6 años)',
  }
  return labels[group] || group
}

export function getAttendanceStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    present: 'Presente',
    absent: 'Ausente',
    justified: 'Justificado',
  }
  return labels[status] || status
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h]
        const str = val == null ? '' : String(val)
        return str.includes(',') ? `"${str}"` : str
      }).join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
