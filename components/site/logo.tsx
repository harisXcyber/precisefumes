import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  priority?: boolean
  /** When true, forces the white (dark-section) logo regardless of theme. */
  variant?: 'auto' | 'white' | 'black'
  alt?: string
}

/**
 * Theme-aware Precise Fumes logo.
 * Uses mix-blend modes to drop the source backgrounds:
 *  - black logo (white bg) -> multiply on light surfaces
 *  - white logo (black bg) -> screen on dark surfaces
 */
export function Logo({
  className,
  priority,
  variant = 'auto',
  alt = 'Precise Fumes',
}: LogoProps) {
  if (variant === 'white') {
    return (
      <span className={cn('relative block', className)}>
        <Image
          src="/logo-white.png"
          alt={alt}
          fill
          priority={priority}
          className="object-contain mix-blend-screen"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </span>
    )
  }
  if (variant === 'black') {
    return (
      <span className={cn('relative block', className)}>
        <Image
          src="/logo-black.png"
          alt={alt}
          fill
          priority={priority}
          className="object-contain mix-blend-multiply"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </span>
    )
  }

  return (
    <span className={cn('relative block', className)}>
      <Image
        src="/logo-black.png"
        alt={alt}
        fill
        priority={priority}
        className="object-contain mix-blend-multiply dark:hidden"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <Image
        src="/logo-white.png"
        alt=""
        aria-hidden
        fill
        priority={priority}
        className="hidden object-contain mix-blend-screen dark:block"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </span>
  )
}
