const MACRO_STYLES = [
  { key: 'protein', label: '蛋白质', color: 'text-[#E8650A]' },
  { key: 'carbs', label: '碳水', color: 'text-[#8B6F47]' },
  { key: 'fats', label: '脂肪', color: 'text-[#7A5C3E]' },
]

export function MealStats({ meal, showMacros = false }) {
  const stats = [
    { value: meal.kcal, label: '千卡' },
    { value: meal.time, label: '时间' },
    { value: meal.difficulty, label: '难度' },
    { value: meal.taste.split('·')[0].trim(), label: '口味' },
  ]

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-[20px] font-bold text-stone-900 leading-none">{stat.value}</p>
            <p className="text-stone-500 text-[8px] tracking-[0.25em] uppercase mt-1.5">{stat.label}</p>
          </div>
        ))}
      </div>
      {showMacros && (
        <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-3 gap-3 text-center">
          {MACRO_STYLES.map((macro) => (
            <div key={macro.key}>
              <p className={`font-display text-[14px] font-bold leading-none ${macro.color}`}>{meal.macros[macro.key]}</p>
              <p className="text-stone-500 text-[8px] tracking-[0.2em] uppercase mt-1">{macro.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
