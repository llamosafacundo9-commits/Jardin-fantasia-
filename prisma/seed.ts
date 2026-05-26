import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, subDays, subMonths, format } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Fantasia2024!', 12)
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@fantasiakinder.edu.uy' },
    update: {},
    create: {
      name: 'Administrador',
      email: process.env.ADMIN_EMAIL || 'admin@fantasiakinder.edu.uy',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created')

  // ─── Settings ───────────────────────────────────────────────────────────────
  const settings = [
    { key: 'phone', value: '099 397 034' },
    { key: 'address', value: '16000 Parque del Plata, Canelones, Uruguay' },
    { key: 'description', value: 'Somos un Centro de Educación Inicial, ubicado en Parque del Plata hace 18 años. Autorizado por el MEC Nº 996.' },
    { key: 'facebook', value: '#' },
    { key: 'instagram', value: '#' },
    { key: 'mec', value: 'MEC Nº 996' },
  ]
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log('✅ Settings seeded')

  // ─── Children ───────────────────────────────────────────────────────────────
  const childrenData = [
    { firstName: 'Valentina', lastName: 'García', dob: '2021-03-15', ageGroup: '3-4', sala: 'Sala Azul', parent: 'María García', phone: '099111111', email: 'maria.garcia@email.com' },
    { firstName: 'Mateo', lastName: 'Rodríguez', dob: '2021-07-22', ageGroup: '3-4', sala: 'Sala Azul', parent: 'Carlos Rodríguez', phone: '099222222', email: 'carlos.rodriguez@email.com' },
    { firstName: 'Sofía', lastName: 'Martínez', dob: '2020-11-08', ageGroup: '4-5', sala: 'Sala Verde', parent: 'Ana Martínez', phone: '099333333', email: 'ana.martinez@email.com' },
    { firstName: 'Lucas', lastName: 'López', dob: '2020-05-30', ageGroup: '4-5', sala: 'Sala Verde', parent: 'Roberto López', phone: '099444444', email: 'roberto.lopez@email.com' },
    { firstName: 'Emilia', lastName: 'González', dob: '2019-09-12', ageGroup: '5-6', sala: 'Sala Roja', parent: 'Patricia González', phone: '099555555', email: 'patricia.gonzalez@email.com' },
    { firstName: 'Benjamín', lastName: 'Pérez', dob: '2019-02-18', ageGroup: '5-6', sala: 'Sala Roja', parent: 'Diego Pérez', phone: '099666666', email: 'diego.perez@email.com' },
    { firstName: 'Camila', lastName: 'Sánchez', dob: '2022-01-25', ageGroup: '2-3', sala: 'Sala Amarilla', parent: 'Lucía Sánchez', phone: '099777777', email: 'lucia.sanchez@email.com' },
    { firstName: 'Tomás', lastName: 'Díaz', dob: '2022-04-10', ageGroup: '2-3', sala: 'Sala Amarilla', parent: 'Fernando Díaz', phone: '099888888', email: 'fernando.diaz@email.com' },
    { firstName: 'Isabella', lastName: 'Fernández', dob: '2021-12-03', ageGroup: '3-4', sala: 'Sala Azul', parent: 'Gabriela Fernández', phone: '099999999', email: 'gabriela.fernandez@email.com' },
    { firstName: 'Santiago', lastName: 'Torres', dob: '2020-08-17', ageGroup: '4-5', sala: 'Sala Verde', parent: 'Marcelo Torres', phone: '098111111', email: 'marcelo.torres@email.com' },
    { firstName: 'Martina', lastName: 'Flores', dob: '2019-06-21', ageGroup: '5-6', sala: 'Sala Roja', parent: 'Silvia Flores', phone: '098222222', email: 'silvia.flores@email.com' },
    { firstName: 'Nicolás', lastName: 'Ruiz', dob: '2022-03-08', ageGroup: '2-3', sala: 'Sala Amarilla', parent: 'Jorge Ruiz', phone: '098333333', email: 'jorge.ruiz@email.com' },
    { firstName: 'Julieta', lastName: 'Morales', dob: '2021-10-14', ageGroup: '3-4', sala: 'Sala Azul', parent: 'Claudia Morales', phone: '098444444', email: 'claudia.morales@email.com' },
    { firstName: 'Agustín', lastName: 'Jiménez', dob: '2020-01-29', ageGroup: '4-5', sala: 'Sala Verde', parent: 'Eduardo Jiménez', phone: '098555555', email: 'eduardo.jimenez@email.com' },
    { firstName: 'Renata', lastName: 'Castro', dob: '2019-11-05', ageGroup: '5-6', sala: 'Sala Roja', parent: 'Monica Castro', phone: '098666666', email: 'monica.castro@email.com' },
  ]

  const children = []
  for (const c of childrenData) {
    const child = await prisma.child.create({
      data: {
        firstName: c.firstName,
        lastName: c.lastName,
        dateOfBirth: new Date(c.dob),
        ageGroup: c.ageGroup,
        sala: c.sala,
        parentName: c.parent,
        parentPhone: c.phone,
        parentEmail: c.email,
        enrollmentDate: subMonths(new Date(), Math.floor(Math.random() * 24)),
        status: 'active',
      },
    })
    children.push(child)
  }
  console.log(`✅ ${children.length} children seeded`)

  // ─── Attendance (3 months) ───────────────────────────────────────────────────
  const today = new Date()
  const attendanceStatuses = ['present', 'present', 'present', 'present', 'absent', 'justified']
  let attendanceCount = 0

  for (let d = 90; d >= 0; d--) {
    const date = subDays(today, d)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue // skip weekends

    for (const child of children) {
      const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)]
      try {
        await prisma.attendance.create({
          data: {
            childId: child.id,
            date: new Date(format(date, 'yyyy-MM-dd') + 'T00:00:00.000Z'),
            status,
          },
        })
        attendanceCount++
      } catch {
        // skip duplicates
      }
    }
  }
  console.log(`✅ ${attendanceCount} attendance records seeded`)

  // ─── Photos ──────────────────────────────────────────────────────────────────
  const photos = [
    { title: 'Salida al parque', category: 'Salidas', seed: 10 },
    { title: 'Pintura con dedos', category: 'Actividades', seed: 20 },
    { title: 'Festejo de cumpleaños', category: 'Eventos', seed: 30 },
    { title: 'Juego en el patio', category: 'Cotidiano', seed: 40 },
    { title: 'Visita al zoológico', category: 'Salidas', seed: 50 },
    { title: 'Manualidades de primavera', category: 'Actividades', seed: 60 },
    { title: 'Día de la familia', category: 'Eventos', seed: 70 },
    { title: 'Ronda de música', category: 'Cotidiano', seed: 80 },
    { title: 'Salida a la plaza', category: 'Salidas', seed: 90 },
    { title: 'Teatro de títeres', category: 'Actividades', seed: 100 },
  ]

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i]
    await prisma.photo.create({
      data: {
        title: p.title,
        url: `https://picsum.photos/seed/${p.seed}/800/600`,
        category: p.category,
        date: subDays(new Date(), i * 7),
        sortOrder: i,
      },
    })
  }
  console.log('✅ 10 photos seeded')

  // ─── News ────────────────────────────────────────────────────────────────────
  await prisma.newsPost.createMany({
    data: [
      {
        title: 'Inicio del año lectivo 2024',
        content: '<p>¡Bienvenidos al nuevo año lectivo! Estamos muy emocionados de recibirlos nuevamente en nuestra institución. Este año tenemos muchas actividades planificadas para el desarrollo integral de nuestros pequeños.</p><p>Las clases comenzarán el <strong>4 de marzo</strong>. Por favor, recuerden traer el material de lista.</p>',
        publishDate: subDays(new Date(), 60),
        pinned: false,
        active: true,
      },
      {
        title: 'Día de la Familia - ¡Los esperamos!',
        content: '<p>El próximo <strong>viernes 15</strong> celebraremos el Día de la Familia. Invitamos a todas las familias a compartir una tarde especial con sus hijos. Habrá actividades, merienda y sorpresas.</p><p>Horario: 16:00 a 18:00 hs.</p>',
        publishDate: subDays(new Date(), 30),
        pinned: true,
        active: true,
      },
      {
        title: 'Inscripciones 2025 ya disponibles',
        content: '<p>Abrimos las inscripciones para el año 2025. Los cupos son limitados. Para más información comunicarse al <strong>099 397 034</strong> o visitarnos en horario de atención.</p><p>Aceptamos niños de 2 a 6 años.</p>',
        publishDate: subDays(new Date(), 7),
        pinned: true,
        active: true,
      },
    ],
  })
  console.log('✅ 3 news posts seeded')

  // ─── Events ──────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        name: 'Día de la Familia',
        date: addDays(new Date(), 5),
        time: '16:00',
        description: 'Celebración especial para compartir con las familias.',
        location: 'Patio del jardín',
      },
      {
        name: 'Acto del 25 de Agosto',
        date: addDays(new Date(), 15),
        time: '10:00',
        description: 'Acto patrio de Independencia del Uruguay.',
        location: 'Salón principal',
      },
      {
        name: 'Fiesta de primavera',
        date: addDays(new Date(), 30),
        time: '15:30',
        description: 'Celebración de la llegada de la primavera con disfraces y juegos.',
        location: 'Jardín y patio',
      },
      {
        name: 'Reunión de padres - Sala Roja',
        date: addDays(new Date(), 10),
        time: '18:00',
        description: 'Reunión informativa para padres de Sala Roja (5-6 años).',
        location: 'Aula Sala Roja',
      },
      {
        name: 'Muestra de fin de año',
        date: addDays(new Date(), 60),
        time: '17:00',
        description: 'Gran muestra de los trabajos y logros del año lectivo.',
        location: 'Salón de actos',
      },
    ],
  })
  console.log('✅ 5 events seeded')

  // ─── Staff ───────────────────────────────────────────────────────────────────
  await prisma.staffMember.createMany({
    data: [
      {
        name: 'Directora María Elena Suárez',
        role: 'Directora',
        photo: 'https://picsum.photos/seed/200/300/300',
        bio: '18 años de trayectoria en educación inicial. Maestra y Directora fundadora del Centro Fantasía.',
        sortOrder: 0,
      },
      {
        name: 'Maestra Claudia Núñez',
        role: 'Maestra - Sala Roja (5-6 años)',
        photo: 'https://picsum.photos/seed/201/300/300',
        bio: 'Especialista en el desarrollo cognitivo de niños en edad preescolar.',
        sortOrder: 1,
      },
      {
        name: 'Maestra Luciana Páez',
        role: 'Maestra - Sala Verde (4-5 años)',
        photo: 'https://picsum.photos/seed/202/300/300',
        bio: 'Apasionada por el aprendizaje a través del juego y las artes.',
        sortOrder: 2,
      },
      {
        name: 'Maestra Fernanda Ríos',
        role: 'Maestra - Sala Azul (3-4 años)',
        photo: 'https://picsum.photos/seed/203/300/300',
        bio: 'Con experiencia en pedagogía Waldorf y educación emocional.',
        sortOrder: 3,
      },
    ],
  })
  console.log('✅ 4 staff members seeded')

  // ─── Sample Contact Messages ──────────────────────────────────────────────────
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Laura Méndez',
        email: 'laura.mendez@email.com',
        message: 'Buenos días, quisiera saber si tienen cupos disponibles para el año 2025 para un niño de 3 años. Muchas gracias.',
        read: false,
        createdAt: subDays(new Date(), 2),
      },
      {
        name: 'Pablo Ramos',
        email: 'pablo.ramos@email.com',
        message: 'Hola, me gustaría agendar una visita al jardín para conocer las instalaciones. ¿Cómo puedo coordinar?',
        read: true,
        createdAt: subDays(new Date(), 5),
      },
      {
        name: 'Cecilia Vega',
        email: 'cecilia.vega@email.com',
        message: '¿Cuál es el horario de atención? Mi hija cumple 2 años en febrero y estamos interesados en anotarla.',
        read: false,
        createdAt: subDays(new Date(), 1),
      },
    ],
  })
  console.log('✅ 3 contact messages seeded')

  console.log('\n🎉 Database seeded successfully!')
  console.log(`\n📧 Admin login: ${process.env.ADMIN_EMAIL || 'admin@fantasiakinder.edu.uy'}`)
  console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Fantasia2024!'}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
