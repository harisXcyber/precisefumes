'use client'

import { useRef, type ElementType } from 'react'
import { useGSAP } from '@/components/site/use-gsap'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type SplitTextProps = {
  text: string
  as?: ElementType
  className?: string
  /** delay in seconds */
  delay?: number
  /** trigger on scroll into view vs on mount */
  trigger?: 'load' | 'scroll'
  by?: 'word' | 'char'
}

export function SplitText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  trigger = 'scroll',
  by = 'word',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const parts = el.querySelectorAll<HTMLElement>('[data-split]')
      if (prefersReducedMotion()) {
        gsap.set(parts, { y: 0, opacity: 1 })
        return
      }

      gsap.set(parts, { yPercent: 115, opacity: 0 })
      const anim = gsap.to(parts, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        delay,
        paused: trigger === 'scroll',
      })

      if (trigger === 'scroll') {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => anim.play(),
        })
        return () => st.kill()
      }
    },
    { scope: ref },
  )

  const tokens = by === 'word' ? text.split(' ') : Array.from(text)

  return (
    <Tag ref={ref} className={cn('inline-block', className)} aria-label={text}>
      {tokens.map((tok, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.08em' }}
        >
          <span data-split className="inline-block will-change-transform">
            {tok === ' ' ? '\u00A0' : tok}
          </span>
          {by === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}
