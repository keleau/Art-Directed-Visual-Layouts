import { getProductGroup } from '../lib/productGroups'

export function ProductArtwork({ item, variant = 'card', className = '' }) {
  const group = getProductGroup(item)
  const isHero = variant === 'hero'

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${group.bg} 0%, #FBF7EE 55%, ${group.bg} 100%)` }}
    >
      <svg className="absolute inset-0 w-full h-full opacity-[0.22]" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="340" cy="60" r="150" fill="none" stroke={group.color} strokeWidth="0.8" strokeDasharray="2 6" />
        <circle cx="50" cy="330" r="110" fill="none" stroke={group.color} strokeWidth="0.6" strokeDasharray="2 5" />
        <circle cx="340" cy="60" r="105" fill="none" stroke={group.color} strokeWidth="0.6" opacity="0.7" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`tracking-[0.45em] uppercase ${isHero ? 'text-[11px]' : 'text-[8px]'}`} style={{ color: group.color, opacity: 0.65 }}>
          {group.en}
        </span>
        <span
          className="font-display font-black leading-none my-1"
          style={{ color: group.color, fontSize: isHero ? '132px' : '58px', opacity: 0.88 }}
        >
          {group.glyph}
        </span>
        <span className={`tracking-[0.3em] ${isHero ? 'text-[13px]' : 'text-[9px]'}`} style={{ color: group.color }}>
          {group.cn}
        </span>
      </div>

      <span className="absolute bottom-2 right-2.5 text-[7px] tracking-[0.25em] uppercase text-stone-500/60">
        FLAVOR ATLAS
      </span>
    </div>
  )
}
