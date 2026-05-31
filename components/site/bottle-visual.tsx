import { cn } from '@/lib/utils'

/**
 * Stylized luxury perfume bottle rendered with layered elements + glass reflection.
 * `tone` tints the liquid; the rest reads as clear glass.
 */
export function BottleVisual({
  tone = 'oklch(0.6 0.08 70)',
  className,
  label,
}: {
  tone?: string
  className?: string
  label?: string
}) {
  return (
    <div className={cn('relative mx-auto flex aspect-[5/9] items-end justify-center', className)}>
      <div className="relative h-full w-full">
        {/* Cap */}
        <div className="absolute left-1/2 top-0 z-20 h-[14%] w-[34%] -translate-x-1/2 rounded-[3px] border border-foreground/15 bg-foreground/10 backdrop-blur-sm" />
        {/* Neck */}
        <div className="absolute left-1/2 top-[13%] z-10 h-[6%] w-[18%] -translate-x-1/2 border-x border-foreground/15 bg-foreground/5" />
        {/* Body */}
        <div className="absolute bottom-0 left-0 z-0 h-[82%] w-full overflow-hidden rounded-[6px] border border-foreground/15 bg-foreground/[0.04] shadow-2xl backdrop-blur-sm">
          {/* Liquid */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%]"
            style={{
              background: `linear-gradient(180deg, color-mix(in oklch, ${tone} 55%, transparent), ${tone})`,
            }}
          />
          {/* Liquid surface line */}
          <div
            className="absolute inset-x-0 top-[38%] h-px"
            style={{ background: `color-mix(in oklch, ${tone} 80%, white)` }}
          />
          {/* Vertical glass reflection */}
          <div className="absolute left-[14%] top-0 h-full w-[12%] bg-gradient-to-b from-white/40 via-white/5 to-transparent" />
          <div className="absolute right-[18%] top-0 h-full w-[6%] bg-gradient-to-b from-white/20 to-transparent" />
          {/* Label */}
          {label ? (
            <div className="absolute inset-x-[18%] top-[24%] flex flex-col items-center gap-1 text-center">
              <span className="font-serif text-[0.65rem] leading-none tracking-wide-lux text-foreground/90">
                {label}
              </span>
              <span className="h-px w-6 bg-foreground/30" />
              <span className="text-[0.4rem] uppercase tracking-luxury text-foreground/60">
                Eau de Parfum
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
