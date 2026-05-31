'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
  /** stagger direct children instead of the element itself */
  stagger?: boolean
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  y = 40,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const targets = stagger ? Array.from(el.children) : el
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }
      gsap.set(targets, { opacity: 0, y })
      const tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay,
        stagger: stagger ? 0.12 : 0,
        paused: true,
      })
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => tween.play(),
      })
      return () => st.kill()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  )
}
