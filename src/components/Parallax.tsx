import { useEffect, useRef, useState } from 'react'

export function Parallax({
  src,
  alt,
  scrollRef,
  speed = 0.15,
  className = '',
  style,
}: {
  src: string
  alt: string
  scrollRef: React.RefObject<HTMLDivElement | null>
  speed?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [y, setY] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let lastScroll = 0
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const current = el.scrollTop
        if (current !== lastScroll) {
          lastScroll = current
          setY(current * speed)
        }
        rafRef.current = 0
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollRef, speed])

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, transform: `translate3d(0, ${-y}px, 0)` }}
    />
  )
}
