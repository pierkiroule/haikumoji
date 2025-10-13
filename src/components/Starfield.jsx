import { useEffect, useMemo, useRef } from 'react'

export default function Starfield({ density = 0.0018, speed = 0.06, twinkle = true, className = '' }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)

  const starsRef = useRef([])
  const params = useMemo(() => ({ density, speed, twinkle }), [density, speed, twinkle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = 0
    let height = 0
    let pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      seedStars()
    }

    function seedStars() {
      const area = width * height
      const starCount = Math.min(2000, Math.floor(area * params.density))
      const stars = new Array(starCount).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        v: (Math.random() * 0.5 + 0.5) * params.speed,
        p: Math.random(),
      }))
      starsRef.current = stars
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      for (const s of starsRef.current) {
        // twinkle by modulating alpha
        const alpha = params.twinkle ? (0.6 + 0.4 * Math.sin((performance.now() * 0.002) + s.p * Math.PI * 2)) : 0.9
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})` // slate-200-ish
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()

        // slight drift towards left to mimic parallax
        s.x -= s.v
        if (s.x < -2) {
          s.x = width + 2
          s.y = Math.random() * height
          s.r = Math.random() * 1.2 + 0.3
          s.v = (Math.random() * 0.5 + 0.5) * params.speed
          s.p = Math.random()
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      ro.disconnect()
    }
  }, [params])

  return (
    <div className={`pointer-events-none absolute inset-0 -z-20 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
