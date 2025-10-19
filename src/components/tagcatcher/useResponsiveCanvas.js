import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Keeps a canvas sized to its container with a fixed aspect ratio.
 * Returns { containerRef, width, height }.
 */
export function useResponsiveCanvas({ aspectRatio = 700 / 480, maxWidth = 900 } = {}) {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 700, height: 480 })

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const resize = () => {
      const cw = Math.min(el.clientWidth || 700, maxWidth)
      const width = Math.max(320, Math.round(cw))
      const height = Math.round(width / aspectRatio)
      setSize({ width, height })
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [aspectRatio, maxWidth])

  // Also adapt on DPR changes (rare but nice to have)
  useEffect(() => {
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    const handler = () => setSize((s) => ({ ...s }))
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  return { containerRef, width: size.width, height: size.height }
}
