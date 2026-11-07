import { IconShoppingCart } from './icons'
import { useDraggableButton } from '../hooks/useDraggableButton'

export function FloatingCartButton({ containerRef, count, open, bounce, onToggle }) {
  const { pos, handlePointerDown, consumeDragClick } = useDraggableButton(containerRef)

  return (
    <button
      data-cart-button
      onPointerDown={handlePointerDown}
      onClick={() => { if (!consumeDragClick()) onToggle() }}
      className={`absolute z-[90] w-12 h-12 rounded-full bg-[#E8650A] text-white flex items-center justify-center shadow-lg shadow-[#E8650A]/30 active:scale-90 transition-transform touch-none select-none cursor-grab active:cursor-grabbing ${
        bounce ? 'animate-cart-bounce' : ''
      } ${open ? 'rotate-45' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      aria-label={`购物车，${count} 件商品`}
    >
      <IconShoppingCart size={20} />
      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-white text-[#E8650A] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#E8650A]">
        {count}
      </span>
    </button>
  )
}
