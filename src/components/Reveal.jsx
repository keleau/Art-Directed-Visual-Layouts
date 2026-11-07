import { useReveal } from "../hooks/useReveal";
function Reveal({
  children,
  delay = 0,
  className = ""
}) {
  const ref = useReveal();
  return <div
    ref={ref}
    className={`reveal ${className}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
      {children}
    </div>;
}
export {
  Reveal
};
