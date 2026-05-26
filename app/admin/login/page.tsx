'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NavbarLogo } from '@/components/public/CastleLogo'
import { Loader2, AlertCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <NavbarLogo />
          <h1 className="font-fredoka text-2xl text-navy mt-4">Panel Administrativo</h1>
          <p className="font-nunito text-gray-500 text-sm">Centro de Educación Inicial Fantasía</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm font-nunito">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-nunito font-semibold">Email</Label>
            <Input type="email" placeholder="admin@fantasiakinder.edu.uy" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-nunito font-semibold">Contraseña</Label>
            <Input type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-navy hover:bg-navy-dark text-white font-fredoka text-base h-12 rounded-xl mt-2"
          >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ingresando...</> : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
