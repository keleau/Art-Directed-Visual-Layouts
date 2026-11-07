export function StatusBar() {
  return (
    <div className="absolute top-0 left-0 right-0 h-11 z-40 flex items-center justify-between px-8 bg-transparent pointer-events-none">
      <span className="font-body text-[11px] font-semibold text-stone-800 pointer-events-auto">9:41</span>
      <div className="flex gap-1.5 items-center pointer-events-auto">
        <div className="w-4 h-2 border border-stone-700 rounded-sm relative">
          <div className="absolute left-0.5 top-0.5 right-0.5 bottom-0.5 bg-stone-700 rounded-[1px]" />
        </div>
      </div>
    </div>
  )
}
