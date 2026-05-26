import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const fredokaOne = Fredoka({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Centro de Educación Inicial Fantasía', template: '%s | Centro Fantasía' },
  description: 'Somos un Centro de Educación Inicial, ubicado en Parque del Plata hace 18 años. Autorizado por el MEC Nº 996.',
  keywords: ['jardín de infantes', 'educación inicial', 'Parque del Plata', 'Canelones', 'Uruguay', 'MEC', 'Fantasía'],
  authors: [{ name: 'Centro de Educación Inicial Fantasía' }],
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    siteName: 'Centro de Educación Inicial Fantasía',
    title: 'Centro de Educación Inicial Fantasía',
    description: 'Somos un Centro de Educación Inicial, ubicado en Parque del Plata hace 18 años. Autorizado por el MEC Nº 996.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fredokaOne.variable} ${nunito.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
