function Eyebrow({
  children,
  num
}) {
  return <div
    className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
    style={{ color: "var(--c-muted)" }}
  >
      {num && <span
    className="font-display text-[13px] animate-num-pop"
    style={{ color: "var(--c-orange)", fontStyle: "italic" }}
  >
          {num}
        </span>}
      <span>{children}</span>
      <span
    className="flex-1 h-px animate-line-draw"
    style={{ background: "currentColor", opacity: 0.25 }}
  />
    </div>;
}
export {
  Eyebrow
};
