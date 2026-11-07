import { useEffect, useRef, useState } from "react";
function Parallax({
  src,
  alt,
  scrollRef,
  speed = 0.15,
  className = "",
  style
}) {
  const [y, setY] = useState(0);
  const rafRef = useRef(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastScroll = 0;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const current = el.scrollTop;
        if (current !== lastScroll) {
          lastScroll = current;
          setY(current * speed);
        }
        rafRef.current = 0;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef, speed]);
  return <img
    src={src}
    alt={alt}
    className={className}
    style={{ ...style, transform: `translate3d(0, ${-y}px, 0)` }}
  />;
}
export {
  Parallax
};
