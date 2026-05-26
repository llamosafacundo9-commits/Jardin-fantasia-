import { NavbarLogo } from '@/components/public/CastleLogo'

export default function Loading() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <NavbarLogo />
        <div className="w-8 h-8 border-4 border-white/20 border-t-crimson rounded-full animate-spin" />
      </div>
    </div>
  )
}
