'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#2B2D8C', '#C0202A', '#3D8C2B', '#8C6B2B']

interface DashboardChartsProps {
  monthlyData: { month: string; present: number; absent: number; justified: number }[]
  ageData: { name: string; value: number }[]
  trendData: { month: string; count: number }[]
}

export function DashboardCharts({ monthlyData, ageData, trendData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly attendance bar chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-fredoka text-navy text-xl">Asistencia mensual (últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-nunito)', fontSize: 12 }} />
              <YAxis tick={{ fontFamily: 'var(--font-nunito)', fontSize: 12 }} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-nunito)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-nunito)', fontSize: 12 }} />
              <Bar dataKey="present" name="Presente" fill="#2B2D8C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Ausente" fill="#C0202A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="justified" name="Justificado" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age distribution donut */}
      <Card>
        <CardHeader>
          <CardTitle className="font-fredoka text-navy text-xl">Distribución por edad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ageData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {ageData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'var(--font-nunito)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-nunito)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enrollment trend line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-fredoka text-navy text-xl">Tendencia de matriculaciones (12 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-nunito)', fontSize: 10 }} />
              <YAxis tick={{ fontFamily: 'var(--font-nunito)', fontSize: 12 }} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-nunito)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" name="Inscripciones" stroke="#2B2D8C" strokeWidth={2} dot={{ fill: '#2B2D8C', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
