import {
  IconCompass,
  IconSun,
  IconPan,
  IconBook
} from "./icons";
const NAV_ITEMS = [
  { id: "explore", label: "探索", icon: IconCompass },
  { id: "today", label: "今日", icon: IconSun },
  { id: "cook", label: "厨房", icon: IconPan },
  { id: "me", label: "我的", icon: IconBook }
];
function BottomNav({
  active,
  onNav
}) {
  const activeIdx = NAV_ITEMS.findIndex((i) => i.id === active);
  return <div
    className="absolute bottom-0 left-0 right-0 glass-nav border-t border-stone-300/50 z-[100]"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
      <div className="relative">
        <div
    className="absolute top-0 h-[3px] bg-[#E8650A] rounded-full transition-all duration-500 ease-out"
    style={{
      width: "24px",
      left: `${activeIdx * 25}%`,
      transform: "translateX(calc(50% - 12px))",
      boxShadow: "0 0 16px rgba(232,101,10,0.5)"
    }}
  />
        <div className="flex">
          {NAV_ITEMS.map((item) => {
    const Ico = item.icon;
    const isActive = active === item.id;
    return <button
      key={item.id}
      data-nav={item.id}
      onClick={() => onNav(item.id)}
      className="flex-1 flex flex-col items-center py-2.5 gap-0.5 relative group"
    >
                <div
      className={`transition-all duration-300 ${isActive ? "scale-110 -translate-y-0.5" : "group-hover:scale-105"}`}
    >
                  <Ico size={22} stroke={isActive ? "#E8650A" : "#8B7355"} />
                </div>
                <span
      className={`font-body text-[9px] tracking-widest uppercase transition-colors ${isActive ? "text-[#E8650A] font-semibold" : "text-stone-500"}`}
    >
                  {item.label}
                </span>
              </button>;
  })}
        </div>
      </div>
      <div className="h-1" />
    </div>;
}
export {
  BottomNav
};
