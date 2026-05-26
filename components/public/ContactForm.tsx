'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { setSuccess(true); reset() }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center gap-4 text-center">
        <CheckCircle size={48} className="text-green-500" />
        <h3 className="font-fredoka text-2xl text-navy">¡Mensaje enviado!</h3>
        <p className="font-nunito text-gray-600 text-sm">
          Gracias por contactarnos. Te responderemos a la brevedad.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline" className="mt-2">
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="font-nunito font-semibold">Nombre completo *</Label>
        <Input id="name" placeholder="Tu nombre" {...register('name')} />
        {errors.name && <p className="text-crimson text-xs font-nunito">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="font-nunito font-semibold">Email *</Label>
        <Input id="email" type="email" placeholder="tu@email.com" {...register('email')} />
        {errors.email && <p className="text-crimson text-xs font-nunito">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message" className="font-nunito font-semibold">Mensaje *</Label>
        <Textarea id="message" placeholder="¿En qué te podemos ayudar?" rows={5} {...register('message')} />
        {errors.message && <p className="text-crimson text-xs font-nunito">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-navy hover:bg-navy-dark text-white font-fredoka text-base h-12 rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
        ) : 'Enviar mensaje'}
      </Button>
    </form>
  )
}
