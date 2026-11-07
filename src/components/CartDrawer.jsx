import { IconX, IconMinus, IconPlus } from './icons'
import { FallbackImage } from './FallbackImage'
import { ProductArtwork } from './ProductArtwork'

export function CartDrawer({
  cart,
  count,
  total,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onOpenItem,
}) {
  return (
    <>
      <div className="absolute inset-0 z-[95] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-[96] bg-white rounded-t-3xl max-h-[70%] flex flex-col animate-slide-up" style={{ bottom: 0 }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <p className="font-display text-[18px] font-bold text-stone-900">购物车</p>
            <p className="text-stone-500 text-[11px] mt-0.5">{count} 件商品</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
            aria-label="关闭购物车"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-stone-400 text-sm">购物车还是空的</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((entry) => (
                <div key={entry.item.id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <button
                    className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0"
                    onClick={() => { if (onOpenItem) { onClose(); onOpenItem(entry.item) } }}
                    aria-label={`查看${entry.item.cn}`}
                  >
                    {entry.item.category === 'dish' ? (
                      <FallbackImage src={entry.item.img} alt={entry.item.cn} className="w-full h-full object-cover" />
                    ) : (
                      <ProductArtwork item={entry.item} className="w-full h-full" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[13px] font-bold text-stone-900 truncate">{entry.item.cn}</p>
                    <p className="text-stone-500 text-[10px] mt-0.5">¥{entry.item.price} / {entry.item.unit}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => onUpdateQuantity(entry.item.id, -1)}
                        className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                        aria-label="减少一件"
                      >
                        <IconMinus size={10} />
                      </button>
                      <span className="font-display text-[13px] font-bold text-stone-900 w-5 text-center">{entry.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(entry.item.id, 1)}
                        className="w-6 h-6 rounded-full bg-[#E8650A] text-white flex items-center justify-center hover:bg-[#D45A09] transition-colors"
                        aria-label="增加一件"
                      >
                        <IconPlus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-[15px] font-black text-[#E8650A]">¥{entry.item.price * entry.quantity}</p>
                    <button
                      onClick={() => onRemove(entry.item.id)}
                      className="text-stone-400 text-[10px] mt-1 hover:text-stone-600 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-[#F3ECE0]/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-stone-600 text-sm">合计</span>
              <span className="font-display text-[22px] font-black text-[#E8650A]">¥{total}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-[#E8650A] text-white rounded-2xl text-[12px] tracking-[0.3em] font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-lg shadow-[#E8650A]/30"
            >
              去结算
            </button>
          </div>
        )}
      </div>
    </>
  )
}
