const base = import.meta.env.BASE_URL

export const image = (file) => `${base}images/${file}`

export const PLACEHOLDER_IMG = image('placeholder.svg')

export const IMGS = {
  landmarkRome: image('scenes/landmarkRome.jpg'),
  landmarkMexico: image('scenes/landmarkMexico.jpg'),
  landmarkBangkok: image('scenes/landmarkBangkok.jpg'),
  landmarkChina: image('scenes/landmarkChina.jpg'),

  pastaPlate: image('food/pastaPlate.jpg'),
  ramenSea: image('food/ramenSea.jpg'),
  mexicoPlate: image('food/mexicoPlate.jpg'),
  croissant: image('scenes/croissant.jpg'),
  thai: image('scenes/thai.jpg'),
  rome: image('scenes/rome.jpg'),
  chili: image('scenes/chili.jpg'),
  vegetables: image('scenes/vegetables.jpg'),
  japanStreet: image('scenes/japanStreet.jpg'),
  market: image('scenes/market.jpg'),
  tomatoes: image('scenes/tomatoes.jpg'),
  spices: image('scenes/spices.jpg'),
  pastaHand: image('scenes/pastaHand.jpg'),
  steakFrites: image('food/steakFrites.jpg'),
  nicoise: image('food/nicoise.jpg'),
  cremeBrulee: image('food/cremeBrulee.jpg'),
  padThai: image('food/padThai.jpg'),
  greenCurry: image('food/greenCurry.jpg'),
  mangoSticky: image('food/mangoSticky.jpg'),
  thaiStreet: image('scenes/thaiStreet.jpg'),
  eiffel: image('scenes/eiffel.jpg'),
  tamagoGohan: image('food/tamagoGohan.jpg'),
  sukiyaki: image('food/sukiyaki.jpg'),
  matchaParfait: image('food/matchaParfait.jpg'),
  bistecca: image('food/bistecca.jpg'),
  tiramisuImg: image('food/tiramisuImg.jpg'),
  huevos: image('food/huevos.jpg'),
  birriaTacos: image('food/birriaTacos.jpg'),
  churros: image('food/churros.jpg'),
  xiaolongbao: image('food/xiaolongbao.jpg'),
  kungpao: image('food/kungpao.jpg'),
  pekingDuck: image('food/pekingDuck.jpg'),
  tangyuan: image('food/tangyuan.jpg'),

  cookingHero: image('scenes/cookingHero.jpg'),

  edamameMiso: image('food/edamameMiso.jpg'),
  takoyaki: image('food/takoyaki.jpg'),
  burrataOlive: image('food/burrataOlive.jpg'),
  pizzaAlTaglio: image('food/pizzaAlTaglio.jpg'),
  guacamole: image('food/guacamole.jpg'),
  elote: image('food/elote.jpg'),
  fromageBlanc: image('food/fromageBlanc.jpg'),
  crepeSuzette: image('food/crepeSuzette.jpg'),
  khanomBueang: image('food/khanomBueang.jpg'),
  khanomJeen: image('food/khanomJeen.jpg'),
  centuryEggTofu: image('food/centuryEggTofu.jpg'),
  jianbing: image('food/jianbing.jpg'),
}

