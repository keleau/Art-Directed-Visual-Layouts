import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 可拖拽浮动按钮：位置限制在容器内，拖动后不会触发点击。
 */
export function useDraggableButton(containerRef, { size = 48, margin = 8, minY = 70 } = {}) {
  const [pos, setPos] = useState({ x: -1, y: -1 })
  const posRef = useRef(pos)
  const rafRef = useRef(null)
  const dragRef = useRef({ started: false, wasDragging: false, offX: 0, offY: 0, rect: null })

  const applyPosition = useCallback((next) => {
    posRef.current = next
    setPos(next)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || posRef.current.x >= 0) return
    const rect = el.getBoundingClientRect()
    applyPosition({
      x: rect.width - size - margin,
      y: rect.height - size - minY - margin,
    })
  }, [containerRef, size, margin, minY, applyPosition])

  const handleMove = useCallback((event) => {
    const drag = dragRef.current
    if (!drag.started || !drag.rect) return
    const { rect, offX, offY } = drag
    const maxX = rect.width - size - margin
    const maxY = rect.height - size - margin
    const nextX = Math.max(margin, Math.min(maxX, event.clientX - rect.left - offX))
    const nextY = Math.max(minY, Math.min(maxY, event.clientY - rect.top - offY))

    if (Math.abs(nextX - posRef.current.x) > 2 || Math.abs(nextY - posRef.current.y) > 2) {
      drag.wasDragging = true
    }
    posRef.current = { x: nextX, y: nextY }
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setPos(posRef.current)
      })
    }
  }, [containerRef, size, margin, minY])

  const handleUp = useCallback(() => {
    dragRef.current.started = false
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setPos(posRef.current)
  }, [handleMove])

  useEffect(() => () => {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
  }, [handleMove, handleUp])

  const handlePointerDown = useCallback((event) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    dragRef.current = {
      started: true,
      wasDragging: false,
      offX: event.clientX - posRef.current.x - rect.left,
      offY: event.clientY - posRef.current.y - rect.top,
      rect,
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    event.preventDefault()
  }, [containerRef, handleMove, handleUp])

  /** 返回 true 表示这次点击是拖拽结束，应当忽略。 */
  const consumeDragClick = useCallback(() => {
    const wasDragging = dragRef.current.wasDragging
    dragRef.current.wasDragging = false
    return wasDragging
  }, [])

  return { pos, handlePointerDown, consumeDragClick }
}
