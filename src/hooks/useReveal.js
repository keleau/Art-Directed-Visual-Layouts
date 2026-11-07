import { useEffect, useRef } from "react";
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
export {
  useReveal
};
