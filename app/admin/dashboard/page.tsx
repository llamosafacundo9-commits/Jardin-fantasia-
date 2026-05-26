import { db } from '@/lib/db'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import { Users, CalendarCheck, TrendingUp, BarChart3, Calendar, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfMonth, subMonths, startOfWeek, endOfWeek, format } from 'date-fns'

export const dynamic = 'force-dynamic'

async function getStats() {
  const now = new Date()
  const thisMonthStart = startOfMonth(now)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [
    totalChildren,
    activeChildren,
    newThisMonth,
    upcomingEvents,
    unreadMessages,
    weekAttendance,
    monthlyAttendance,
    ageGroups,
    enrollmentTrend,
  ] = await Promise.all([
    db.child.count(),
    db.child.count({ where: { status: 'active' } }),
    db.child.count({ where: { enrollmentDate: { gte: thisMonthStart } } }),
    db.event.count({ where: { date: { gte: now } } }),
    db.contactMessage.count({ where: { read: false } }),
    // This week's attendance
    db.attendance.groupBy({
      by: ['status'],
      where: { date: { gte: weekStart, lte: weekEnd } },
      _count: { status: true },
    }),
    // Last 6 months attendance per month
    db.attendance.findMany({
      where: { date: { gte: subMonths(now, 6) } },
      select: { date: true, status: true },
    }),
    // Age group distribution
    db.child.groupBy({
      by: ['ageGroup'],
      where: { status: 'active' },
      _count: { ageGroup: true },
    }),
    // Last 12 months enrollments
    db.child.findMany({
      where: { enrollmentDate: { gte: subMonths(now, 12) } },
      select: { enrollmentDate: true },
    }),
  ])

  // Attendance rate this week
  const totalWeek = weekAttendance.reduce((s, g) => s + g._count.status, 0)
  const presentWeek = weekAttendance.find(g => g.status === 'present')?._count.status || 0
  const attendanceRate = totalWeek ? Math.round((presentWeek / totalWeek) * 100) : 0

  // Monthly attendance chart data (last 6 months)
  const monthlyMap: Record<string, { present: number; absent: number; justified: number }> = {}
  for (let i = 5; i >= 0; i--) {
    const key = format(subMonths(now, i), 'MMM')
    monthlyMap[key] = { present: 0, absent: 0, justified: 0 }
  }
  monthlyAttendance.forEach(a => {
    const key = format(a.date, 'MMM')
    if (monthlyMap[key]) monthlyMap[key][a.status as keyof typeof monthlyMap[string]]++
  })
  const monthlyChartData = Object.entries(monthlyMap).map(([month, counts]) => ({
    month, ...counts,
  }))

  // Age group chart data
  const ageLabels: Record<string, string> = {
    '2-3': '2-3 años', '3-4': '3-4 años', '4-5': '4-5 años', '5-6': '5-6 años',
  }
  const ageChartData = ageGroups.map(g => ({
    name: ageLabels[g.ageGroup] || g.ageGroup,
    value: g._count.ageGroup,
  }))

  // Enrollment trend (last 12 months)
  const trendMap: Record<string, number> = {}
  for (let i = 11; i >= 0; i--) {
    trendMap[format(subMonths(now, i), 'MMM yy')] = 0
  }
  enrollmentTrend.forEach(c => {
    const key = format(c.enrollmentDate, 'MMM yy')
    if (trendMap[key] !== undefined) trendMap[key]++
  })
  const trendChartData = Object.entries(trendMap).map(([month, count]) => ({ month, count }))

  return {
    totalChildren, activeChildren, newThisMonth, upcomingEvents, unreadMessages, attendanceRate,
    monthlyChartData, ageChartData, trendChartData,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Niños matriculados', value: stats.totalChildren, icon: Users, color: 'text-navy', bg: 'bg-blue-50' },
    { label: 'Activos este mes', value: stats.activeChildren, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Altas este mes', value: stats.newThisMonth, icon: TrendingUp, color: 'text-crimson', bg: 'bg-red-50' },
    { label: 'Asistencia esta semana', value: `${stats.attendanceRate}%`, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Próximos eventos', value: stats.upcomingEvents, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Mensajes sin leer', value: stats.unreadMessages, icon: MessageSquare, color: 'text-navy', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fredoka text-3xl text-navy">Dashboard</h1>
        <p className="font-nunito text-gray-500 text-sm">Resumen general del jardín</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon size={20} className={card.color} />
              </div>
              <p className={`font-fredoka text-2xl ${card.color}`}>{card.value}</p>
              <p className="font-nunito text-xs text-gray-500 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        monthlyData={stats.monthlyChartData}
        ageData={stats.ageChartData}
        trendData={stats.trendChartData}
      />
    </div>
  )
}
