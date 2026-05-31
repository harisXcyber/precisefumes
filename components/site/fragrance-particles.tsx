'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type Particle = {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  a: number
  drift: number
}

export function FragranceParticles({
  className,
  density = 60,
}: {
  className?: string
  density?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (prefersReducedMotion()) return

    let raf = 0
    let w = 0
    let h = 0
    let particles: Particle[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init()
    }

    const init = () => {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.3 + 0.08),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.5 + 0.1,
        drift: Math.random() * Math.PI * 2,
      }))
    }

    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--gold')
        .trim() || 'oklch(0.8 0.09 84)'

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const color = accent()
      for (const p of particles) {
        p.drift += 0.01
        p.y += p.vy
        p.x += p.vx + Math.sin(p.drift) * 0.18
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color.startsWith('oklch')
          ? color.replace(')', ` / ${p.a})`)
          : color
        ctx.globalAlpha = p.a
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
