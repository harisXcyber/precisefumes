'use client'

import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

type UseGSAPConfig = {
  scope?: RefObject<HTMLElement | null>
  /** dependency list to re-run the effect */
  deps?: unknown[]
}

/**
 * Lightweight useGSAP-style hook backed by gsap.context for automatic cleanup.
 * The callback may return its own cleanup function.
 */
export function useGSAP(
  callback: () => void | (() => void),
  config: UseGSAPConfig = {},
) {
  const { scope, deps = [] } = config
  const cleanupRef = useRef<void | (() => void)>(undefined)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cleanupRef.current = callback()
    }, scope?.current ?? undefined)

    return () => {
      if (typeof cleanupRef.current === 'function') cleanupRef.current()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
