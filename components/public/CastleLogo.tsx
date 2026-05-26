import { cn } from '@/lib/utils'

interface CastleLogoProps {
  className?: string
  size?: number
  animated?: boolean
}

export function CastleLogo({ className, size = 120, animated = false }: CastleLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && 'animate-float', className)}
      aria-label="Logo Centro de Educación Inicial Fantasía"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="96" fill="#2B2D8C" />

      {/* Battlements - left tower top */}
      <rect x="18" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="32" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="46" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />

      {/* Left tower body */}
      <rect x="16" y="64" width="46" height="76" rx="2" fill="#F5F2EE" />

      {/* Left tower windows */}
      <rect x="26" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="44" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="26" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="44" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />

      {/* Center tower - taller */}
      <rect x="68" y="72" width="64" height="68" rx="2" fill="#F5F2EE" />

      {/* Center tower roof (triangle) */}
      <polygon points="68,72 100,28 132,72" fill="#C0202A" />

      {/* Center tower arched door */}
      <rect x="88" y="108" width="24" height="32" rx="12" fill="#2B2D8C" />

      {/* Center tower windows */}
      <rect x="76" y="84" width="14" height="14" rx="2" fill="#2B2D8C" />
      <rect x="110" y="84" width="14" height="14" rx="2" fill="#2B2D8C" />

      {/* Right tower */}
      <rect x="138" y="64" width="46" height="76" rx="2" fill="#F5F2EE" />

      {/* Right tower roof (triangle) */}
      <polygon points="138,64 161,30 184,64" fill="#C0202A" />

      {/* Right tower windows */}
      <rect x="144" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="162" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="144" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="162" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />

      {/* Right battlements */}
      <rect x="138" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="152" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="166" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="180" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />

      {/* Ground / base */}
      <rect x="16" y="138" width="168" height="10" rx="2" fill="#1A1C6B" />

      {/* Stars */}
      <circle cx="52" cy="38" r="3" fill="#F5F2EE" opacity="0.7" />
      <circle cx="148" cy="38" r="3" fill="#F5F2EE" opacity="0.7" />
      <circle cx="100" cy="18" r="2" fill="#F5F2EE" opacity="0.5" />
    </svg>
  )
}

export function NavbarLogo({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Fantasía"
    >
      <circle cx="100" cy="100" r="96" fill="#2B2D8C" />
      <rect x="18" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="32" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="46" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="16" y="64" width="46" height="76" rx="2" fill="#F5F2EE" />
      <rect x="26" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="44" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="26" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="44" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="68" y="72" width="64" height="68" rx="2" fill="#F5F2EE" />
      <polygon points="68,72 100,28 132,72" fill="#C0202A" />
      <rect x="88" y="108" width="24" height="32" rx="12" fill="#2B2D8C" />
      <rect x="76" y="84" width="14" height="14" rx="2" fill="#2B2D8C" />
      <rect x="110" y="84" width="14" height="14" rx="2" fill="#2B2D8C" />
      <rect x="138" y="64" width="46" height="76" rx="2" fill="#F5F2EE" />
      <polygon points="138,64 161,30 184,64" fill="#C0202A" />
      <rect x="144" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="162" y="76" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="144" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="162" y="100" width="12" height="14" rx="2" fill="#2B2D8C" />
      <rect x="138" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="152" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="166" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="180" y="52" width="10" height="12" rx="1" fill="#F5F2EE" />
      <rect x="16" y="138" width="168" height="10" rx="2" fill="#1A1C6B" />
    </svg>
  )
}
