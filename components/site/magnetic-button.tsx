'use client'

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'ghost'
  className?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return
    const el = wrapRef.current
    const inner = innerRef.current
    if (!el || !inner) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: 'power3.out' })
    gsap.to(inner, { x: x * 0.18, y: y * 0.18, duration: 0.6, ease: 'power3.out' })
  }

  const onLeave = () => {
    gsap.to([wrapRef.current, innerRef.current], {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  const styles = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[0.72rem] uppercase tracking-wide-lux transition-colors duration-300',
    variant === 'solid' &&
      'bg-foreground text-background hover:bg-accent hover:text-accent-foreground',
    variant === 'outline' &&
      'border border-foreground/25 text-foreground hover:border-accent hover:text-accent',
    variant === 'ghost' && 'text-foreground/70 hover:text-accent',
    className,
  )

  const content = (
    <span ref={innerRef} className={styles}>
      {children}
    </span>
  )

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform"
    >
      {href ? (
        <Link href={href}>{content}</Link>
      ) : (
        <button type="button" onClick={onClick}>
          {content}
        </button>
      )}
    </span>
  )
}
