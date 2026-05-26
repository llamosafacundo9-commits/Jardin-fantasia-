import { db } from '@/lib/db'
import { ConfiguracionClient } from '@/components/admin/ConfiguracionClient'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const settingsRaw = await db.setting.findMany()
  const settings = Object.fromEntries(settingsRaw.map(s => [s.key, s.value]))
  return <ConfiguracionClient settings={settings} />
}
