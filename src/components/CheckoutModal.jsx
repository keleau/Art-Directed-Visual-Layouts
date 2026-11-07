import { useEffect, useState } from 'react'
import { IconX, IconCheck } from './icons'

export function CheckoutModal({ cart, total, onClose, onPay }) {
  const [paid, setPaid] = useState(false)
  const [paidTotal, setPaidTotal] = useState(0)

  useEffect(() => {
    if (!paid) return undefined
    const timer = setTimeout(onClose, 1800)
    return () => clearTimeout(timer)
  }, [paid, onClose])

  const handlePay = () => {
    setPaidTotal(total)
    setPaid(true)
    onPay()
  }

  return (
    <>
      <div className="absolute inset-0 z-[97] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={paid ? undefined : onClose} />
      <div className="absolute left-1/2 top-1/2 z-[98] -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl w-[340px] animate-pop-in">
        {paid ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E8650A]/10 flex items-center justify-center mb-5">
              <IconCheck size={30} stroke="#E8650A" />
            </div>
            <h3 className="font-display text-[24px] font-black text-stone-900 leading-tight">下单成功</h3>
            <p className="text-stone-500 text-[13px] mt-2">演示订单已提交，合计 ¥{paidTotal}</p>
            <p className="text-stone-400 text-[11px] mt-1">演示环境，不会产生真实扣款。</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-1">Checkout</p>
                <h3 className="font-display text-[22px] font-black text-stone-900 leading-tight">确认订单</h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                aria-label="关闭结算"
              >
                <IconX size={14} />
              </button>
            </div>

            <div className="space-y-2 mb-5 max-h-[200px] overflow-y-auto">
              {cart.map((entry) => (
                <div key={entry.item.id} className="flex justify-between text-sm">
                  <span className="text-stone-700 truncate mr-2">{entry.item.cn} × {entry.quantity}</span>
                  <span className="font-bold text-stone-900 shrink-0">¥{entry.item.price * entry.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">合计</span>
                <span className="font-display text-[24px] font-black text-[#E8650A]">¥{total}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-700 text-[12px] tracking-[0.2em] font-bold hover:bg-stone-200 active:scale-[0.98] transition-all"
              >
                再想想
              </button>
              <button
                onClick={handlePay}
                className="flex-1 py-3 rounded-2xl bg-[#E8650A] text-white text-[12px] tracking-[0.2em] font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-md shadow-[#E8650A]/30"
              >
                确认支付
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
