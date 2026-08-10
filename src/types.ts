export type Screen = 'splash' | 'explore' | 'today' | 'cook' | 'recipe' | 'me' | 'search'
export type NavScreen = 'explore' | 'today' | 'cook' | 'me'
export type Country = 'japan' | 'italy' | 'mexico' | 'france' | 'thailand' | 'china'
export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'streetFood'

export type Meal = {
  en: string
  cn: string
  story: string
  kcal: number
  time: string
  img: string
  taste: string
  price: number
  difficulty: string
  macros: { protein: string; carbs: string; fats: string }
  recipe: { ingredients: Ingredient[]; steps: Step[] }
}

export type Ingredient = { n: string; t: string }
export type Step = { n: string; t: string; d: string }

export type CountryData = {
  flag: string
  name: string
  cn: string
  blurb: string
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  dessert: Meal
  snack: Meal
  streetFood: Meal
}

export type HeroData = {
  dayLabel: string
  country: Country
  heroImg: string
  featuredMealKey: MealKey
  chefMealKey: MealKey
  quote: string
  quoteAuthor: string
  description: string
  latLng: string
  chefName: string
  chefTitle: string
  heroSubtitle: string
}

export type IconProps = {
  size?: number
  className?: string
  stroke?: string
  style?: React.CSSProperties
}
