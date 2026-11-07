import { IconPlus } from './icons'
import { FallbackImage } from './FallbackImage'
import { ProductArtwork } from './ProductArtwork'
import { SHOP_COUNTRIES } from '../data'

export function ProductCard({ item, onOpen, onAdd, justAdded = false, index = 0 }) {
  const flag = item.country ? SHOP_COUNTRIES.find((c) => c.id === item.country)?.flag : ''
  const isDish = item.category === 'dish'

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(26,18,8,0.08)] hover:shadow-[0_8px_24px_-8px_rgba(26,18,8,0.15)] transition-all duration-500 group border border-stone-100/80 hover:border-stone-200/80 cursor-pointer active:scale-[0.985]"
      style={{ animation: 'fadeUp 0.6s cubic-bezier(.2,.7,.2,1) both', animationDelay: `${index * 35}ms` }}
      data-product-id={item.id}
      onClick={() => onOpen(item)}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-stone-50">
        {isDish ? (
          <FallbackImage
            src={item.img}
            alt={item.cn}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <ProductArtwork
            item={item}
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {flag && (
          <span className="absolute top-2.5 left-2.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[11px] shadow-sm">
            {flag}
          </span>
        )}
        {item.tags && item.tags.length > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#E8650A] text-white text-[8px] tracking-[0.15em] font-bold rounded-full shadow-sm">
            {item.tags[0]}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h4 className="font-display text-[14px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#C9550A] transition-colors">
          {item.cn}
        </h4>
        <p className="text-stone-400 text-[10px] mt-1 line-clamp-1">{item.name}</p>
        {item.sourceMeal && (
          <p className="text-stone-400/60 text-[9px] mt-1 italic line-clamp-1">来自 {item.sourceMeal}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
          <div className="flex items-baseline gap-0.5">
            <span className="font-display text-[16px] font-black text-[#E8650A]">¥{item.price}</span>
            <span className="text-stone-400 text-[9px]">/{item.unit}</span>
          </div>
          <button
            onClick={(event) => { event.stopPropagation(); onAdd(item) }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
              justAdded
                ? 'bg-[#E8650A] text-white scale-110 shadow-md shadow-[#E8650A]/25'
                : 'bg-[#1A1208] text-[#E8650A] hover:bg-[#2A2218] hover:scale-105'
            }`}
            aria-label={`把${item.cn}加入购物车`}
          >
            <IconPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
