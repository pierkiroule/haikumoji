// Physics update for TagCatcher nodes (simple bounce in bounds)

/**
 * Update node positions in-place for animation when star is not formed.
 * @param {Array} nodes - Array of node objects with x,y,vx,vy,r
 * @param {number} width
 * @param {number} height
 */
export function updateNodes(nodes, width, height) {
  for (const b of nodes) {
    b.x += b.vx
    b.y += b.vy
    if (b.x < b.r || b.x > width - b.r) b.vx *= -1
    if (b.y < b.r || b.y > height - b.r) b.vy *= -1
  }
}
