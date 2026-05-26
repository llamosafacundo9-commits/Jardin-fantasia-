import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/admin/login' },
})

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/ninos/:path*',
    '/admin/asistencia/:path*',
    '/admin/galeria/:path*',
    '/admin/noticias/:path*',
    '/admin/eventos/:path*',
    '/admin/equipo/:path*',
    '/admin/mensajes/:path*',
    '/admin/configuracion/:path*',
  ],
}
