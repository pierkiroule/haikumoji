// Pure drawing routine for TagCatcher canvas
// Does not mutate React state; only reads provided values

/**
 * Draw a single frame of the TagCatcher scene.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} state
 * @param {number} state.width
 * @param {number} state.height
 * @param {Array} state.nodes
 * @param {Array} state.selected
 * @param {Array} state.points
 * @param {string} state.centerTitle
 * @param {boolean} state.starFormed
 */
export function drawScene(ctx, state) {
  const { width: W, height: H, nodes, selected, points, centerTitle, starFormed } = state

  ctx.clearRect(0, 0, W, H)

  // Background gradient
  const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H))
  grad.addColorStop(0, '#060c18')
  grad.addColorStop(1, '#000000')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Draw emoji bubbles
  nodes.forEach((b) => {
    if (starFormed && !b.selected) return // hide unselected after star formed
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r + 6, 0, Math.PI * 2)
    ctx.strokeStyle = b.selected ? 'rgba(120,240,255,0.9)' : 'rgba(255,255,255,0.15)'
    ctx.lineWidth = b.selected ? 2.5 : 1
    ctx.stroke()

    ctx.font = b.selected ? '38px system-ui, -apple-system, Segoe UI, sans-serif' : '30px system-ui, -apple-system, Segoe UI, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(255,255,255,0.9)'
    ctx.shadowBlur = b.selected ? 6 : 0
    ctx.fillStyle = '#ffffff'
    ctx.fillText(b.emoji, b.x, b.y)
    ctx.shadowBlur = 0
  })

  if (selected.length === 5) {
    // Network lines
    ctx.strokeStyle = 'rgba(120,240,255,0.75)'
    ctx.lineWidth = 1.8
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        ctx.beginPath()
        ctx.moveTo(selected[i].x, selected[i].y)
        ctx.lineTo(selected[j].x, selected[j].y)
        ctx.stroke()
      }
    }

    // Pulsing points
    points.forEach((p) => {
      const pulse = p.filled ? 1 : Math.sin(Date.now() / 300 + p.id) * 0.3 + 0.9
      ctx.beginPath()
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = p.filled ? '#5cd6ff' : `rgba(255,170,0,${pulse})`
      ctx.fill()

      if (p.word) {
        ctx.font = '13px Poppins, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.textAlign = 'center'
        ctx.fillText(p.word, p.x, p.y - 16)
      }
    })

    // Breathing center halo + title
    const cx = W / 2
    const cy = H / 2
    const breathe = Math.sin(Date.now() / 700) * 0.15 + 0.85
    ctx.beginPath()
    ctx.arc(cx, cy, 18 + 2 * breathe, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(120,240,255,0.6)'
    ctx.lineWidth = 1.4
    ctx.stroke()

    if (centerTitle) {
      ctx.font = '16px Poppins, system-ui, sans-serif'
      ctx.fillStyle = '#cfefff'
      ctx.textAlign = 'center'
      ctx.fillText(centerTitle, cx, cy - 28)
    }
  }
}
