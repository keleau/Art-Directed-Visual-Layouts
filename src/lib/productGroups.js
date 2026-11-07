const GROUPS = {
  seafood: { glyph: '鲜', cn: '海鲜', en: 'SEAFOOD', color: '#2B5F8E', bg: '#E4EDF4' },
  meat: { glyph: '肉', cn: '肉禽', en: 'MEAT', color: '#8B3A2A', bg: '#F3E4DC' },
  dairy: { glyph: '乳', cn: '乳品', en: 'DAIRY', color: '#A67C2E', bg: '#F7EFDC' },
  spice: { glyph: '香', cn: '香料', en: 'SPICE', color: '#B4551E', bg: '#F6E8D8' },
  sauce: { glyph: '酱', cn: '酱料', en: 'SAUCE', color: '#6B2A2A', bg: '#F1E0DC' },
  grain: { glyph: '粮', cn: '粮油豆', en: 'PANTRY', color: '#7A6A3F', bg: '#F0EBDD' },
  produce: { glyph: '蔬', cn: '时蔬', en: 'PRODUCE', color: '#4A6741', bg: '#E8EFE1' },
  other: { glyph: '味', cn: '风物', en: 'PANTRY', color: '#8B7355', bg: '#F2ECE0' },
}

const RULES = [
  { group: 'seafood', pattern: /虾|鱼|章鱼|金枪鱼|三文鱼/ },
  { group: 'meat', pattern: /牛肉|牛胸|鸡|猪|火腿|叉烧|羊/ },
  { group: 'dairy', pattern: /芝士|奶酪|奶油|黄油|鸡蛋|马苏里拉|帕玛森|孔泰|布拉塔|白奶酪/ },
  { group: 'spice', pattern: /藏红花|胡椒|海盐|甜椒粉|山葵|芥末|松露/ },
  { group: 'sauce', pattern: /酱|油|醋|味醂|椰浆|鱼露|糖浆|蜂蜜|出汁|味噌/ },
  { group: 'grain', pattern: /面|米|粉|饼|面筋|海苔|豆腐/ },
  { group: 'produce', pattern: /番茄|罗勒|香菜|葱|蒜|姜|辣椒|洋葱|胡萝卜|鳄梨|青柠|香茅|南姜|香菇|刺山柑|橄榄|毛豆|玉米/ },
]

export function getProductGroup(item) {
  const match = RULES.find((rule) => rule.pattern.test(item.cn))
  return GROUPS[match?.group || 'other']
}
