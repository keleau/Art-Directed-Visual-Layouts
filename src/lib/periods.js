export function getChinaHour() {
  const now = new Date()
  return (now.getUTCHours() + 8) % 24
}

export function periodFromHour(hour) {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 19) return 'evening'
  return 'night'
}

export const PERIOD_LABELS = {
  morning: { en: 'Morning', cn: '早晨' },
  afternoon: { en: 'Afternoon', cn: '下午' },
  evening: { en: 'Evening', cn: '黄昏' },
  night: { en: 'Night', cn: '夜晚' },
}

export const PERIOD_MEAL_INDEX = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
}

export const MEAL_META = [
  { label: 'Breakfast', cn: '早餐', time: '07:00', key: 'breakfast', bg: 'var(--c-morning-1)', accent: 'var(--c-morning-3)', ink: '#5C3E14' },
  { label: 'Lunch', cn: '午餐', time: '12:30', key: 'lunch', bg: 'var(--c-afternoon-1)', accent: 'var(--c-afternoon-3)', ink: '#6B2A0A' },
  { label: 'Dinner', cn: '晚餐', time: '19:30', key: 'dinner', bg: 'var(--c-dusk-1)', accent: 'var(--c-dusk-3)', ink: '#4A3A2A' },
  { label: 'Dessert', cn: '甜点', time: '21:30', key: 'dessert', bg: 'var(--c-night-1)', accent: 'var(--c-night-3)', ink: '#EBD9C4' },
]
