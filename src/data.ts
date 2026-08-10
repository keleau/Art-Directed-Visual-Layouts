import type { Screen, NavScreen, Country, MealKey, Meal, CountryData, HeroData, IconProps } from './types'

export const IMGS = {
  // Country landmarks (for hero sections)
  landmarkRome:    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=900&fit=crop&auto=format',
  landmarkNaples:  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=900&fit=crop&auto=format',
  landmarkTokyo:   'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&h=900&fit=crop&auto=format',
  landmarkKyoto:   'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=900&fit=crop&auto=format',
  landmarkMexico:  'https://images.pexels.com/photos/19231570/pexels-photo-19231570.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  landmarkBangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&h=900&fit=crop&auto=format',
  landmarkChina:   'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&h=900&fit=crop&auto=format',
  // Food & ingredient images (for meal cards)
  pastaDry:    'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=1200&h=1600&fit=crop&auto=format',
  pastaPlate:  'https://images.pexels.com/photos/34797458/pexels-photo-34797458.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  ramen:       'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1200&h=1500&fit=crop&auto=format',
  ramenSea:    'https://images.pexels.com/photos/37322364/pexels-photo-37322364.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  mexicoPlate: 'https://images.pexels.com/photos/29530030/pexels-photo-29530030.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  croissant:   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=900&fit=crop&auto=format',
  thai:        'https://images.pexels.com/photos/10756648/pexels-photo-10756648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  rome:        'https://images.unsplash.com/photo-1529154036614-a60975f5c760?w=1200&h=900&fit=crop&auto=format',
  chili:       'https://images.unsplash.com/photo-1592201426550-83c4be24a0a7?w=1600&h=900&fit=crop&auto=format',
  vegetables:  'https://images.unsplash.com/photo-1553787434-45e1d245bfbb?w=1200&h=1500&fit=crop&auto=format',
  japanStreet: 'https://images.unsplash.com/photo-1548148870-adbf75452257?w=1200&h=900&fit=crop&auto=format',
  market:      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1200&h=1500&fit=crop&auto=format',
  tomatoes:    'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=1200&h=1500&fit=crop&auto=format',
  spices:      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=1500&fit=crop&auto=format',
  pastaHand:   'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&h=1500&fit=crop&auto=format',
  steakFrites: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&h=1500&fit=crop&auto=format',
  nicoise:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=1500&fit=crop&auto=format',
  cremeBrulee: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=1200&h=1500&fit=crop&auto=format',
  padThai:     'https://images.pexels.com/photos/34723310/pexels-photo-34723310.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  greenCurry:  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&h=1500&fit=crop&auto=format',
  mangoSticky: 'https://images.unsplash.com/photo-1705056508219-0aa0ceb16820?w=1200&h=1500&fit=crop&auto=format',
  thaiStreet:  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=900&fit=crop&auto=format',
  eiffel:      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=900&fit=crop&auto=format',
  sushi:       'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=1500&fit=crop&auto=format',
  pizzaNapoli: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=1500&fit=crop&auto=format',
  // France dishes
  duckConfit:  'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1200&h=1500&fit=crop&auto=format',
  // Japan dishes
  tamagoGohan: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=1500&fit=crop&auto=format',
  sukiyaki:    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1200&h=1500&fit=crop&auto=format',
  matchaParfait: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1200&h=1500&fit=crop&auto=format',
  karaageDon:  'https://images.pexels.com/photos/31317036/pexels-photo-31317036.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  wagyuKatsu:  'https://images.unsplash.com/photo-1580822184713-fc5d50fe4cf1?w=1200&h=1500&fit=crop&auto=format',
  // Italy dishes
  bistecca:    'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&h=1500&fit=crop&auto=format',
  tiramisuImg: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&h=1500&fit=crop&auto=format',
  // Mexico dishes
  huevos:      'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=1200&h=1500&fit=crop&auto=format',
  birriaTacos: 'https://images.pexels.com/photos/31632714/pexels-photo-31632714.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  churros:     'https://images.pexels.com/photos/4128504/pexels-photo-4128504.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  // China dishes
  xiaolongbao: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&h=1500&fit=crop&auto=format',
  kungpao:     'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1200&h=1500&fit=crop&auto=format',
  pekingDuck:  'https://images.pexels.com/photos/5848607/pexels-photo-5848607.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  tangyuan:    'https://images.pexels.com/photos/1938266/pexels-photo-1938266.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  mapoTofu:    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&h=1500&fit=crop&auto=format',
  // Cook page hero
  cookingHero: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=900&fit=crop&auto=format',
  // New snack & street food images (from Pexels)
  edamameMiso: 'https://images.pexels.com/photos/15881377/pexels-photo-15881377.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  takoyaki: 'https://images.pexels.com/photos/25050466/pexels-photo-25050466.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  burrataOlive: 'https://images.pexels.com/photos/28841119/pexels-photo-28841119.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  pizzaAlTaglio: 'https://images.pexels.com/photos/33987719/pexels-photo-33987719.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  guacamole: 'https://images.pexels.com/photos/25244620/pexels-photo-25244620.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  elote: 'https://images.pexels.com/photos/17582268/pexels-photo-17582268.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  fromageBlanc: 'https://images.pexels.com/photos/6004726/pexels-photo-6004726.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  crepeSuzette: 'https://images.pexels.com/photos/4725646/pexels-photo-4725646.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  khanomBueang: 'https://images.pexels.com/photos/25430628/pexels-photo-25430628.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  khanomJeen: 'https://images.pexels.com/photos/7413153/pexels-photo-7413153.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  centuryEggTofu: 'https://images.pexels.com/photos/5266094/pexels-photo-5266094.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
  jianbing: 'https://images.pexels.com/photos/36034214/pexels-photo-36034214.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop',
}

export const COUNTRIES: Record<Country, CountryData> = {
  japan: {
    flag: 'JP', name: 'Japan', cn: '日本',
    blurb: 'Order from a neighborhood diner at dawn. Slurp ramen at midnight. Japan is a quiet precision of flavors.',
    breakfast: {
      en: 'Tamago Gohan', cn: '玉子拌饭', story: 'A still-warm bowl of rice, a nest of fresh egg yolk, and a whisper of shoyu. The Japanese weekday breakfast you eat standing up, alone, grateful for five quiet minutes.', kcal: 320, time: '10 min', img: IMGS.tamagoGohan, taste: 'Umami · Mild',
      price: 68, difficulty: 'Easy', macros: { protein: '16g', carbs: '38g', fats: '12g' },
      recipe: {
        ingredients: [
          { n: '1 bowl', t: 'steamed short-grain rice' },
          { n: '1', t: 'fresh egg yolk' },
          { n: '1 tsp', t: 'shoyu (soy sauce)' },
          { n: '1 tbsp', t: 'chopped green onion' },
        ],
        steps: [
          { n: '01', t: 'Warm the bowl', d: 'Rinse a serving bowl with hot water and dry it. Warm rice goes in first.' },
          { n: '02', t: 'Nest the yolk', d: 'Scoop a slight well into the rice. Gently place the yolk in the center.' },
          { n: '03', t: 'Season simply', d: 'Drizzle shoyu around the yolk. Scatter green onion.' },
          { n: '04', t: 'Mix and eat', d: 'Break the yolk with chopsticks and stir until each grain glistens.' },
        ],
      },
    },
    lunch: {
      en: 'Tonkotsu Ramen', cn: '豚骨拉面', story: 'At 11pm in Shinjuku, the shopmen are still pulling noodles. Steam rolls off the bowls, the broth is thick as velvet, and nobody talks. This is Tokyo listening to itself eat.', kcal: 750, time: '25 min', img: IMGS.ramenSea, taste: 'Rich · Savory',
      price: 98, difficulty: 'Medium', macros: { protein: '34g', carbs: '72g', fats: '28g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'fresh ramen noodles' },
          { n: '400ml', t: 'tonkotsu broth' },
          { n: '2 slices', t: 'chashu pork belly' },
          { n: '1', t: 'soft-boiled ajitama egg' },
        ],
        steps: [
          { n: '01', t: 'Boil the broth', d: 'Bring tonkotsu broth to a gentle simmer. Keep it rolling, not boiling.' },
          { n: '02', t: 'Cook the noodles', d: 'Boil fresh noodles for 90 seconds — no longer. Drain firmly.' },
          { n: '03', t: 'Assemble the bowl', d: 'Pour hot broth over the noodles. Arrange chashu and halved egg.' },
          { n: '04', t: 'Finish', d: 'Top with nori, white sesame, and a drizzle of chili oil.' },
        ],
      },
    },
    dinner: {
      en: 'Wagyu Sukiyaki', cn: '和牛寿喜锅', story: 'Slices of marble-red beef swim in sweet-savoury warishita. Friends pick leaves and mushrooms from the same cast-iron pot. Everything gets a raw-egg dip, and then a second bowl of rice.', kcal: 880, time: '40 min', img: IMGS.sukiyaki, taste: 'Deep · Umami',
      price: 218, difficulty: 'Medium', macros: { protein: '42g', carbs: '18g', fats: '52g' },
      recipe: {
        ingredients: [
          { n: '300g', t: 'wagyu sirloin, sliced thin' },
          { n: '1 bunch', t: 'shungiku (chrysanthemum greens)' },
          { n: '200g', t: 'enoki mushrooms' },
          { n: '100ml', t: 'sukiyaki sauce (warishita)' },
        ],
        steps: [
          { n: '01', t: 'Heat the pot', d: 'Melt a piece of wagyu fat in a cast-iron pot over medium heat.' },
          { n: '02', t: 'Caramelize the sauce', d: 'Add warishita sauce and let it bubble until fragrant.' },
          { n: '03', t: 'Cook the beef', d: 'Swish each slice in the bubbling sauce for 10-15 seconds.' },
          { n: '04', t: 'Add vegetables', d: 'Push beef aside, cook shungiku and enoki. Dip in raw egg and eat.' },
        ],
      },
    },
    dessert: {
      en: 'Matcha Parfait', cn: '抹茶芭菲', story: 'Stone-ground matcha over anko, mochi that stretch, a dusting of kinako that smells like roasted childhood. This is Kyoto in a glass — sweet, bitter, gone too quickly.', kcal: 280, time: '5 min', img: IMGS.matchaParfait, taste: 'Bittersweet',
      price: 56, difficulty: 'Easy', macros: { protein: '6g', carbs: '44g', fats: '10g' },
      recipe: {
        ingredients: [
          { n: '2 scoops', t: 'matcha ice cream' },
          { n: '100g', t: 'sweet red bean paste (anko)' },
          { n: '3 tbsp', t: 'shiratama mochi balls' },
          { n: '1 tbsp', t: 'kinako (roasted soy flour)' },
        ],
        steps: [
          { n: '01', t: 'Layer the glass', d: 'Start with anko at the bottom, followed by crushed ice.' },
          { n: '02', t: 'Add ice cream', d: 'Scoop matcha ice cream on top. Let it soften slightly.' },
          { n: '03', t: 'Top with mochi', d: 'Arrange shiratama balls around the parfait edge.' },
          { n: '04', t: 'Dust and serve', d: 'Sprinkle kinako through a fine sieve. Serve with a long spoon.' },
        ],
      },
    },
    snack: {
      en: 'Edamame & Miso Soup', cn: '毛豆味噌汤', story: 'A small bowl of edamame, still bright green and flecked with sea salt. Beside it, a chawanmushi — silken egg custard with dashi, the flavor of a Japanese afternoon in a cup.', kcal: 220, time: '8 min', img: IMGS.edamameMiso, taste: 'Umami · Light',
      price: 42, difficulty: 'Easy', macros: { protein: '14g', carbs: '12g', fats: '8g' },
      recipe: {
        ingredients: [
          { n: '150g', t: 'edamame, steamed' },
          { n: '1 bowl', t: 'miso soup' },
          { n: '1 tsp', t: 'sea salt' },
          { n: '2 cups', t: 'dashi stock' },
        ],
        steps: [
          { n: '01', t: 'Steam edamame', d: 'Steam edamame 5 minutes until bright green. Sprinkle with sea salt.' },
          { n: '02', t: 'Heat dashi', d: 'Bring dashi stock to a gentle simmer. Do not boil.' },
          { n: '03', t: 'Add miso', d: 'Whisk in white miso paste until dissolved.' },
          { n: '04', t: 'Serve', d: 'Ladle into bowl. Serve with edamame on the side.' },
        ],
      },
    },
    streetFood: {
      en: 'Takoyaki', cn: '章鱼烧', story: 'Osaka in a ball — batter bubbling with octopus bits, takoyaki sauce thick and sweet, a rain of bonito flakes dancing in the steam. You buy six, share two, eat four.', kcal: 480, time: '15 min', img: IMGS.takoyaki, taste: 'Sweet · Savory',
      price: 68, difficulty: 'Medium', macros: { protein: '22g', carbs: '52g', fats: '16g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'takoyaki flour mix' },
          { n: '100g', t: 'octopus, diced' },
          { n: '2 tbsp', t: 'takoyaki sauce' },
          { n: '1 tbsp', t: 'bonito flakes' },
        ],
        steps: [
          { n: '01', t: 'Make batter', d: 'Mix flour with water and egg until smooth.' },
          { n: '02', t: 'Heat the pan', d: 'Preheat takoyaki pan. Oil generously.' },
          { n: '03', t: 'Cook', d: 'Pour batter, add octopus bits. Cook 3 minutes, flip, cook 2 more.' },
          { n: '04', t: 'Finish', d: 'Drizzle with takoyaki sauce. Top with bonito flakes.' },
        ],
      },
    },
  },
  italy: {
    flag: 'IT', name: 'Italy', cn: '意大利',
    blurb: 'Sun-warmed tomatoes, hand-rolled pasta, wine-dark olives. Italy eats slowly and loves loudly.',
    breakfast: {
      en: 'Cornetto & Caffè', cn: '意式牛角包', story: 'A bar counter at 8:30am. A warm cornetto, one sugar-sticky twist of a croissant, and an espresso pulled in 27 seconds. You drink standing up, pay cash, and leave — that is the Roman morning.', kcal: 280, time: '5 min', img: IMGS.croissant, taste: 'Sweet · Light',
      price: 38, difficulty: 'Easy', macros: { protein: '8g', carbs: '34g', fats: '14g' },
      recipe: {
        ingredients: [
          { n: '1', t: 'cornetto (Italian croissant)' },
          { n: '1 shot', t: 'espresso, freshly pulled' },
          { n: '1 tbsp', t: 'apricot jam (optional)' },
          { n: '—', t: 'granulated sugar, to taste' },
        ],
        steps: [
          { n: '01', t: 'Heat the cornetto', d: 'Warm it in a 160°C oven for 3 minutes. It should be just warm, not hot.' },
          { n: '02', t: 'Pull the espresso', d: 'A single shot — 25ml, 27 seconds. Crema should hold.' },
          { n: '03', t: 'Assemble', d: 'Serve cornetto on a small plate. Coffee in a demitasse. Sugar on the side.' },
        ],
      },
    },
    lunch: {
      en: 'Cacio e Pepe', cn: '奶酪黑椒意面', story: 'Pecorino, pepper, pasta water. Three ingredients, no shortcuts. The Romans say a good cacio e pepe should look like it was made by someone who is in a hurry to go to dinner.', kcal: 680, time: '20 min', img: IMGS.pastaPlate, taste: 'Rich · Peppery',
      price: 98, difficulty: 'Medium', macros: { protein: '28g', carbs: '64g', fats: '32g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'tonnarelli or spaghetti' },
          { n: '100g', t: 'pecorino romano, finely grated' },
          { n: '60g', t: 'guanciale or pancetta, cubed' },
          { n: '2 tsp', t: 'black pepper, freshly ground' },
        ],
        steps: [
          { n: '01', t: 'Bring water to a boil', d: 'Salt generously — it should taste like the sea.' },
          { n: '02', t: 'Render the guanciale', d: 'Low heat, no oil. Let it crisp slowly in its own fat.' },
          { n: '03', t: 'Toast the pepper', d: 'Dry pan, 30 seconds until fragrant. This is the secret.' },
          { n: '04', t: 'Emulsify', d: 'Off heat. Add pecorino and pasta water. Stir like you mean it.' },
        ],
      },
    },
    dinner: {
      en: 'Bistecca Fiorentina', cn: '佛罗伦萨牛排', story: 'A porterhouse thick as a novel, grilled over oak until the crust is charred black, the inside pink and quiet. Florentines share it at long wooden tables with a bottle of Chianti and no side dish — it does not need friends.', kcal: 920, time: '35 min', img: IMGS.bistecca, taste: 'Bold · Smoky',
      price: 268, difficulty: 'Advanced', macros: { protein: '68g', carbs: '2g', fats: '72g' },
      recipe: {
        ingredients: [
          { n: '1.2kg', t: 'porterhouse steak, 3cm thick' },
          { n: '—', t: 'coarse sea salt' },
          { n: '—', t: 'freshly cracked black pepper' },
          { n: '3 tbsp', t: 'extra-virgin olive oil' },
        ],
        steps: [
          { n: '01', t: 'Temper the meat', d: 'Take the steak out 45 minutes before cooking. Pat dry.' },
          { n: '02', t: 'Build the fire', d: 'Charcoal is essential. Wait until the coals are white-hot.' },
          { n: '03', t: 'Grill hard', d: '5 minutes per side over the hottest part. Flip once.' },
          { n: '04', t: 'Rest and serve', d: 'Rest 8 minutes on a warm plate. Drizzle olive oil, finish with salt flakes.' },
        ],
      },
    },
    dessert: {
      en: 'Tiramisu', cn: '提拉米苏', story: 'Ladyfingers dipped in espresso, layered with mascarpone that still tastes of cold cream, then buried under a drift of cocoa. The Venetian dessert that makes you forget you are full.', kcal: 350, time: '8 min', img: IMGS.tiramisuImg, taste: 'Creamy · Coffee',
      price: 68, difficulty: 'Easy', macros: { protein: '8g', carbs: '42g', fats: '18g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'mascarpone cheese' },
          { n: '12', t: 'ladyfinger biscuits (savoiardi)' },
          { n: '150ml', t: 'strong espresso, cooled' },
          { n: '2 tbsp', t: 'cocoa powder' },
        ],
        steps: [
          { n: '01', t: 'Whip the mascarpone', d: 'Beat mascarpone with a splash of espresso until creamy.' },
          { n: '02', t: 'Dip the biscuits', d: 'Quick dip — 1 second per side. Soggy savoiardi ruin the texture.' },
          { n: '03', t: 'Layer', d: 'Alternate dipped biscuits and mascarpone cream in a dish.' },
          { n: '04', t: 'Chill and dust', d: 'Refrigerate 4 hours. Dust generously with cocoa before serving.' },
        ],
      },
    },
    snack: {
      en: 'Burrata & Olive', cn: '布拉塔橄榄', story: 'A soft burrata blob, cream oozing from its center, surrounded by olives from Puglia, basil torn by hand, and a drizzle of olive oil that tastes like the afternoon sun.', kcal: 320, time: '5 min', img: IMGS.burrataOlive, taste: 'Creamy · Savory',
      price: 78, difficulty: 'Easy', macros: { protein: '14g', carbs: '4g', fats: '28g' },
      recipe: {
        ingredients: [
          { n: '1 ball', t: 'burrata cheese' },
          { n: '100g', t: 'black olives' },
          { n: 'fresh', t: 'basil leaves' },
          { n: '2 tbsp', t: 'extra virgin olive oil' },
        ],
        steps: [
          { n: '01', t: 'Prepare', d: 'Remove burrata from fridge 15 minutes before serving.' },
          { n: '02', t: 'Arrange', d: 'Place burrata on plate. Surround with olives and torn basil.' },
          { n: '03', t: 'Drizzle', d: 'Pour olive oil generously. Season with flaky salt.' },
          { n: '04', t: 'Serve', d: 'Serve immediately with crusty bread.' },
        ],
      },
    },
    streetFood: {
      en: 'Pizza al Taglio', cn: '切片披萨', story: 'A Roman square, a paper tray, a slice of pizza al taglio with rosemary and potato or maybe just tomato and mozzarella. It depends on the hour and the queue.', kcal: 520, time: '10 min', img: IMGS.pizzaAlTaglio, taste: 'Crispy · Cheesy',
      price: 48, difficulty: 'Easy', macros: { protein: '20g', carbs: '58g', fats: '18g' },
      recipe: {
        ingredients: [
          { n: '1 slice', t: 'pizza al taglio base' },
          { n: '100g', t: 'mozzarella' },
          { n: '1/2 cup', t: 'tomato sauce' },
          { n: 'fresh', t: 'basil' },
        ],
        steps: [
          { n: '01', t: 'Preheat oven', d: 'Heat oven to 250°C.' },
          { n: '02', t: 'Top', d: 'Spread tomato sauce. Add mozzarella.' },
          { n: '03', t: 'Bake', d: 'Bake 8 minutes until crust is golden.' },
          { n: '04', t: 'Finish', d: 'Top with basil. Slice and serve.' },
        ],
      },
    },
  },
  mexico: {
    flag: 'MX', name: 'Mexico', cn: '墨西哥',
    blurb: 'Smoked chillies, charred corn, lime-salted air. A country that eats out loud and in color.',
    breakfast: {
      en: 'Huevos Rancheros', cn: '牧场鸡蛋', story: 'A rancho breakfast at sunrise. Corn tortillas charred on the comal, runny yolks, red salsa still bubbling from the pan, beans on the side, lime for the plate.', kcal: 420, time: '15 min', img: IMGS.huevos, taste: 'Spicy · Hearty',
      price: 56, difficulty: 'Easy', macros: { protein: '22g', carbs: '28g', fats: '24g' },
      recipe: {
        ingredients: [
          { n: '2', t: 'corn tortillas' },
          { n: '2', t: 'eggs, fried sunny-side' },
          { n: '100ml', t: 'salsa roja' },
          { n: '2 tbsp', t: 'refried beans' },
        ],
        steps: [
          { n: '01', t: 'Warm the tortillas', d: 'Char them lightly on a comal or dry pan until blistered.' },
          { n: '02', t: 'Heat the salsa', d: 'Simmer salsa roja in a small pan until it darkens.' },
          { n: '03', t: 'Fry the eggs', d: 'Crispy edges, runny yolk. Slide onto the tortillas.' },
          { n: '04', t: 'Assemble', d: 'Spoon salsa over eggs. Serve beans on the side with a wedge of lime.' },
        ],
      },
    },
    lunch: {
      en: 'Birria Tacos', cn: '比利亚肉汤塔可', story: 'Beef braised for hours with guajillo until it falls apart. You dip tortillas in the consommé before you fill them, then dip the finished taco again. Jalisco invented lunch that smells like a fire.', kcal: 690, time: '45 min', img: IMGS.birriaTacos, taste: 'Spiced · Rich',
      price: 118, difficulty: 'Advanced', macros: { protein: '38g', carbs: '32g', fats: '36g' },
      recipe: {
        ingredients: [
          { n: '400g', t: 'beef chuck, cubed' },
          { n: '3', t: 'dried guajillo chillies, rehydrated' },
          { n: '8', t: 'corn tortillas' },
          { n: '1', t: 'lime, wedged' },
        ],
        steps: [
          { n: '01', t: 'Blend the adobo', d: 'Blend rehydrated guajillos with garlic, cumin, and broth.' },
          { n: '02', t: 'Braise the beef', d: 'Sear the beef, then simmer in adobo for 2 hours until fork-tender.' },
          { n: '03', t: 'Shred and dip', d: 'Shred beef. Dip tortillas in braising fat before filling.' },
          { n: '04', t: 'Griddle and serve', d: 'Cook tacos on a hot griddle until crisp. Serve with consommé for dipping.' },
        ],
      },
    },
    dinner: {
      en: 'Mole Poblano', cn: '摩尔酱鸡', story: 'Twenty-eight ingredients, three days. Dried chillies, bitter chocolate, sesame, cinnamon, the ghost of garlic. The story goes that a nun dreamed this sauce into being — and every Poblana has cooked it since.', kcal: 780, time: '60 min', img: IMGS.mexicoPlate, taste: 'Complex · Dark',
      price: 168, difficulty: 'Advanced', macros: { protein: '44g', carbs: '38g', fats: '42g' },
      recipe: {
        ingredients: [
          { n: '4', t: 'chicken thighs, bone-in' },
          { n: '200g', t: 'mole paste (store-bought or homemade)' },
          { n: '1 tbsp', t: 'sesame seeds' },
          { n: '—', t: 'warm corn tortillas' },
        ],
        steps: [
          { n: '01', t: 'Brown the chicken', d: 'Season and sear skin-side down until deep gold.' },
          { n: '02', t: 'Simmer in mole', d: 'Dilute mole paste with chicken stock. Submerge chicken and simmer 40 min.' },
          { n: '03', t: 'Rest the sauce', d: 'Let the mole rest 10 minutes. It thickens and deepens.' },
          { n: '04', t: 'Serve', d: 'Plate chicken with a generous ladle of mole. Sprinkle sesame and serve with tortillas.' },
        ],
      },
    },
    dessert: {
      en: 'Churros con Chocolate', cn: '巧克力吉拿棒', story: 'Street vendors sell them in paper cones in the winter. Cinnamon sugar still hot, chocolate thick enough to stand a spoon in. You break off a piece and dip, again and again, until your fingers are sticky.', kcal: 310, time: '10 min', img: IMGS.churros, taste: 'Sweet · Crisp',
      price: 42, difficulty: 'Medium', macros: { protein: '6g', carbs: '38g', fats: '16g' },
      recipe: {
        ingredients: [
          { n: '120g', t: 'all-purpose flour' },
          { n: '100g', t: 'dark chocolate (70%)' },
          { n: '—', t: 'cinnamon sugar for dusting' },
          { n: '—', t: 'vegetable oil for frying' },
        ],
        steps: [
          { n: '01', t: 'Make the choux', d: 'Boil water, butter, and salt. Add flour and stir until a smooth dough forms.' },
          { n: '02', t: 'Pipe and fry', d: 'Pipe 10cm strips into 180°C oil. Fry 3-4 minutes until deep golden.' },
          { n: '03', t: 'Make the chocolate', d: 'Melt chocolate with cream. Stir until glossy.' },
          { n: '04', t: 'Finish', d: 'Roll hot churros in cinnamon sugar. Serve with warm chocolate for dipping.' },
        ],
      },
    },
    snack: {
      en: 'Guacamole & Totopos', cn: '鳄梨酱玉米片', story: 'An avocado half, a wooden molcajete, lime juice that fizzes with salt, serrano minced fine, cilantro torn. You dip, you eat, you make more.', kcal: 260, time: '8 min', img: IMGS.guacamole, taste: 'Fresh · Spicy',
      price: 38, difficulty: 'Easy', macros: { protein: '4g', carbs: '16g', fats: '20g' },
      recipe: {
        ingredients: [
          { n: '2', t: 'ripe avocados' },
          { n: '1', t: 'lime, juiced' },
          { n: '1/2', t: 'serrano chilli, minced' },
          { n: '1/4 cup', t: 'chopped cilantro' },
        ],
        steps: [
          { n: '01', t: 'Mash', d: 'Scoop avocado into bowl. Mash to preferred consistency.' },
          { n: '02', t: 'Season', d: 'Add lime juice, salt, and diced serrano.' },
          { n: '03', t: 'Mix', d: 'Fold in cilantro. Taste and adjust.' },
          { n: '04', t: 'Serve', d: 'Serve immediately with totopos.' },
        ],
      },
    },
    streetFood: {
      en: 'Elote', cn: '烤玉米', story: 'A grilled corn cob, still hot, slathered in crema Mexicana, coated in cotija cheese, dusted with chile-lime powder, a lime wedge tucked in the foil. You eat it from a stick, kernels popping between your teeth.', kcal: 340, time: '10 min', img: IMGS.elote, taste: 'Creamy · Spicy',
      price: 28, difficulty: 'Easy', macros: { protein: '8g', carbs: '42g', fats: '14g' },
      recipe: {
        ingredients: [
          { n: '4', t: 'ears of corn, husked' },
          { n: '1/2 cup', t: 'crema Mexicana' },
          { n: '1/2 cup', t: 'cotija cheese, crumbled' },
          { n: '2 tbsp', t: 'chile-lime powder' },
        ],
        steps: [
          { n: '01', t: 'Grill corn', d: 'Grill corn over high heat 10 minutes, turning until charred.' },
          { n: '02', t: 'Slather', d: 'Roll hot corn in crema Mexicana.' },
          { n: '03', t: 'Coat', d: 'Roll in cotija cheese, pressing to adhere.' },
          { n: '04', t: 'Season', d: 'Dust with chile-lime powder. Serve with lime wedge.' },
        ],
      },
    },
  },
  france: {
    flag: 'FR', name: 'France', cn: '法国',
    blurb: 'Butter, wine, and a certain joie de vivre. France eats with patience and drinks with conviction.',
    breakfast: {
      en: 'Croissant & Café au Lait', cn: '牛角包配拿铁', story: 'The boulangerie at 7am smells like butter and electricity. You tear a croissant open, layer by lamination layer, while the café au lait cools in its big bowl. Paris eats this way, every morning, in no particular rush.', kcal: 340, time: '8 min', img: IMGS.croissant, taste: 'Buttery · Light',
      price: 48, difficulty: 'Easy', macros: { protein: '8g', carbs: '32g', fats: '20g' },
      recipe: {
        ingredients: [
          { n: '1', t: 'all-butter croissant' },
          { n: '150ml', t: 'whole milk' },
          { n: '1 shot', t: 'fresh espresso' },
          { n: '1 tbsp', t: 'unsalted butter' },
        ],
        steps: [
          { n: '01', t: 'Warm the croissant', d: 'Slice horizontally and warm in a 160°C oven for 4 minutes.' },
          { n: '02', t: 'Heat the milk', d: 'Warm milk gently — do not boil. A light foam is ideal.' },
          { n: '03', t: 'Combine café au lait', d: 'Pull the espresso into a warm bowl. Add warm milk in a steady stream.' },
          { n: '04', t: 'Serve', d: 'Place croissant on a plate with the butter. Dip and enjoy slowly.' },
        ],
      },
    },
    lunch: {
      en: 'Salade Niçoise', cn: '尼斯沙拉', story: 'Seared tuna barely kissed, haricots verts still holding their crunch, potatoes still warm from the pot, olives that taste of the sea. It is Nice on a plate — the Mediterranean in a single bite.', kcal: 480, time: '15 min', img: IMGS.nicoise, taste: 'Fresh · Herby',
      price: 78, difficulty: 'Easy', macros: { protein: '26g', carbs: '14g', fats: '34g' },
      recipe: {
        ingredients: [
          { n: '150g', t: 'seared tuna loin' },
          { n: '4', t: 'boiled potatoes, halved' },
          { n: '100g', t: 'green beans, blanched' },
          { n: '3 tbsp', t: 'Niçoise olives' },
        ],
        steps: [
          { n: '01', t: 'Sear the tuna', d: 'Season the tuna. Sear 90 seconds per side. Slice against the grain.' },
          { n: '02', t: 'Blanch the vegetables', d: 'Boil green beans 2 minutes, then ice bath. Cook potatoes until just tender.' },
          { n: '03', t: 'Make the vinaigrette', d: 'Whisk Dijon, red wine vinegar, and olive oil. Season.' },
          { n: '04', t: 'Assemble', d: 'Arrange ingredients on a platter. Dress generously. Serve at room temperature.' },
        ],
      },
    },
    dinner: {
      en: 'Steak Frites', cn: '牛排薯条', story: 'The bistro at 8pm. A crusty sear on the sirloin, a pink centre, frites so hot they scorch your thumb, a pool of beurre maitre dhotel melting slowly on the meat. Simple. Perfect. French.', kcal: 820, time: '30 min', img: IMGS.steakFrites, taste: 'Bold · Crisp',
      price: 198, difficulty: 'Medium', macros: { protein: '52g', carbs: '38g', fats: '46g' },
      recipe: {
        ingredients: [
          { n: '250g', t: 'sirloin steak' },
          { n: '2', t: 'large potatoes, cut into frites' },
          { n: '2 tbsp', t: 'duck fat or beef tallow' },
          { n: '—', t: 'fleur de sel' },
        ],
        steps: [
          { n: '01', t: 'Prepare the frites', d: 'Soak cut potatoes in cold water 15 minutes. Dry thoroughly.' },
          { n: '02', t: 'Double-fry', d: 'Fry at 160°C for 5 min, then 190°C for 3 min until deep gold and crisp.' },
          { n: '03', t: 'Cook the steak', d: 'Sear in duck fat over high heat — 3-4 minutes per side for medium-rare.' },
          { n: '04', t: 'Rest and serve', d: 'Rest steak 5 minutes on a warm plate. Serve with frites and fleur de sel.' },
        ],
      },
    },
    dessert: {
      en: 'Crème Brûlée', cn: '焦糖布丁', story: 'Cold cream custard under a crust of amber sugar. You tap it with the back of a spoon, it cracks, you feel smart. The French have been doing this since 1691 and they still get away with it.', kcal: 360, time: '12 min', img: IMGS.cremeBrulee, taste: 'Creamy · Vanilla',
      price: 58, difficulty: 'Medium', macros: { protein: '6g', carbs: '28g', fats: '26g' },
      recipe: {
        ingredients: [
          { n: '500ml', t: 'heavy cream' },
          { n: '5', t: 'egg yolks' },
          { n: '100g', t: 'caster sugar' },
          { n: '1', t: 'vanilla pod, split' },
        ],
        steps: [
          { n: '01', t: 'Infuse the cream', d: 'Heat cream with vanilla pod until small bubbles form around the edge.' },
          { n: '02', t: 'Temper the eggs', d: 'Whisk yolks with sugar. Slowly pour warm cream into yolks while whisking.' },
          { n: '03', t: 'Bake', d: 'Strain into ramekins. Bake in a water bath at 150°C for 40 minutes.' },
          { n: '04', t: 'Brûlée', d: 'Chill 2 hours. Cover surface with thin sugar layer. Torch until amber.' },
        ],
      },
    },
    snack: {
      en: 'Fromage Blanc & Honey', cn: '白奶酪蜂蜜', story: 'A thick slab of fromage blanc, the color of cream with a slight grain, topped with lavender honey that runs slowly down the side, a handful of toasted walnuts. French afternoon in one small bowl.', kcal: 280, time: '5 min', img: IMGS.fromageBlanc, taste: 'Creamy · Sweet',
      price: 58, difficulty: 'Easy', macros: { protein: '12g', carbs: '16g', fats: '18g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'fromage blanc' },
          { n: '3 tbsp', t: 'lavender honey' },
          { n: '2 tbsp', t: 'walnuts, toasted' },
          { n: 'fresh', t: 'berries' },
        ],
        steps: [
          { n: '01', t: 'Prepare', d: 'Place fromage blanc in serving bowl.' },
          { n: '02', t: 'Drizzle', d: 'Pour honey over the top generously.' },
          { n: '03', t: 'Top', d: 'Add walnuts and fresh berries.' },
          { n: '04', t: 'Serve', d: 'Serve immediately with a spoon.' },
        ],
      },
    },
    streetFood: {
      en: 'Crêpe Suzette', cn: '橙味可丽饼', story: 'A thin crêpe, golden and delicate, folded in quarters, soaked in an orange-butter sauce flambéed with Grand Marnier. The cart is on Rue Cler, the waiter has a towel over his arm.', kcal: 480, time: '15 min', img: IMGS.crepeSuzette, taste: 'Sweet · Citrus',
      price: 62, difficulty: 'Medium', macros: { protein: '8g', carbs: '52g', fats: '24g' },
      recipe: {
        ingredients: [
          { n: '4', t: 'crêpes' },
          { n: '80g', t: 'unsalted butter' },
          { n: '3 tbsp', t: 'sugar' },
          { n: '3 tbsp', t: 'orange juice' },
        ],
        steps: [
          { n: '01', t: 'Make sauce', d: 'Melt butter with sugar. Add orange juice and Grand Marnier.' },
          { n: '02', t: 'Fold crêpes', d: 'Fold crêpes in quarters and place in sauce.' },
          { n: '03', t: 'Flambé', d: 'Pour Grand Marnier. Ignite carefully.' },
          { n: '04', t: 'Serve', d: 'Serve immediately while flames die down.' },
        ],
      },
    },
  },
  thailand: {
    flag: 'TH', name: 'Thailand', cn: '泰国',
    blurb: 'Lemongrass, coconut, and chilli heat. Thailand balances sweet, sour, salty, and spicy in every bowl.',
    breakfast: {
      en: 'Khao Piek Sen', cn: '米粉汤', story: 'A street-stall breakfast in Chiang Mai. Rice noodles in chicken broth, a handful of fried garlic, white pepper that clears your sinuses. You slurp it standing up in the shade of a banyan tree, next to a monk.', kcal: 350, time: '15 min', img: IMGS.thaiStreet, taste: 'Savory · Herbal',
      price: 38, difficulty: 'Easy', macros: { protein: '14g', carbs: '46g', fats: '12g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'rice noodles (sen lek)' },
          { n: '500ml', t: 'chicken broth' },
          { n: '100g', t: 'shredded chicken' },
          { n: '1 tbsp', t: 'fried garlic with oil' },
        ],
        steps: [
          { n: '01', t: 'Simmer the broth', d: 'Bring chicken broth to a boil with a knob of ginger and garlic.' },
          { n: '02', t: 'Cook the noodles', d: 'Add rice noodles to the broth. Cook 3 minutes until translucent.' },
          { n: '03', t: 'Add the chicken', d: 'Shred pre-cooked chicken into the pot. Warm through.' },
          { n: '04', t: 'Serve', d: 'Ladle into bowls. Top with fried garlic, white pepper, and spring onion.' },
        ],
      },
    },
    lunch: {
      en: 'Pad Thai', cn: '泰式炒河粉', story: 'Tamarind, palm sugar, fish sauce, lime. The wok is so hot it smokes. Prawns go pink, noodles go glossy, peanuts go crunchy. Thailand put balance on a plate and called it Pad Thai.', kcal: 620, time: '20 min', img: IMGS.padThai, taste: 'Sweet · Spicy',
      price: 68, difficulty: 'Medium', macros: { protein: '22g', carbs: '74g', fats: '24g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'flat rice noodles' },
          { n: '100g', t: 'prawns, peeled' },
          { n: '2 tbsp', t: 'tamarind paste' },
          { n: '1 cup', t: 'bean sprouts' },
        ],
        steps: [
          { n: '01', t: 'Soak the noodles', d: 'Soak noodles in warm water 25 minutes until pliable. Drain.' },
          { n: '02', t: 'Make the sauce', d: 'Mix tamarind, fish sauce, palm sugar, and a pinch of chilli.' },
          { n: '03', t: 'Wok the noodles', d: 'High heat. Stir-fry prawns, add noodles and sauce. Toss vigorously.' },
          { n: '04', t: 'Finish', d: 'Push to one side. Crack an egg and scramble it. Toss with bean sprouts and peanuts.' },
        ],
      },
    },
    dinner: {
      en: 'Green Curry', cn: '绿咖喱鸡', story: 'Fresh coconut milk simmered with green chillies pounded that morning. Galangal, kaffir lime, Thai basil that disappears into the steam. You eat it over jasmine rice, sweating, happy.', kcal: 720, time: '35 min', img: IMGS.greenCurry, taste: 'Fragrant · Spicy',
      price: 98, difficulty: 'Medium', macros: { protein: '36g', carbs: '22g', fats: '48g' },
      recipe: {
        ingredients: [
          { n: '300g', t: 'chicken thigh, sliced' },
          { n: '400ml', t: 'coconut milk' },
          { n: '3 tbsp', t: 'green curry paste' },
          { n: '1 cup', t: 'Thai basil leaves' },
        ],
        steps: [
          { n: '01', t: 'Fry the paste', d: 'In a wok, fry green curry paste in 2 tbsp coconut cream until fragrant.' },
          { n: '02', t: 'Cook the chicken', d: 'Add chicken. Stir-fry in the paste until sealed on all sides.' },
          { n: '03', t: 'Simmer', d: 'Pour in remaining coconut milk. Simmer 20 minutes until chicken is tender.' },
          { n: '04', t: 'Finish with basil', d: 'Stir in Thai basil and a splash of fish sauce. Serve over jasmine rice.' },
        ],
      },
    },
    dessert: {
      en: 'Mango Sticky Rice', cn: '芒果糯米饭', story: 'The mango must be Nam Dok Mai, yellow as honey, yielding under the knife. The rice must be soaked overnight, steamed, then bathed in sweet coconut cream. Thailand serves summer in a coconut shell.', kcal: 380, time: '10 min', img: IMGS.mangoSticky, taste: 'Sweet · Coconut',
      price: 48, difficulty: 'Easy', macros: { protein: '6g', carbs: '64g', fats: '14g' },
      recipe: {
        ingredients: [
          { n: '1', t: 'ripe mango, sliced' },
          { n: '150g', t: 'glutinous rice, pre-soaked' },
          { n: '200ml', t: 'coconut milk' },
          { n: '1 tbsp', t: 'toasted sesame seeds' },
        ],
        steps: [
          { n: '01', t: 'Steam the rice', d: 'Steam soaked glutinous rice 20 minutes until translucent and tender.' },
          { n: '02', t: 'Warm the coconut milk', d: 'Heat coconut milk with sugar and salt. Do not boil.' },
          { n: '03', t: 'Combine', d: 'Pour warm coconut milk over the steamed rice. Let it absorb 10 minutes.' },
          { n: '04', t: 'Plate', d: 'Mold the rice on a plate. Fan mango slices alongside. Drizzle remaining coconut sauce and sesame.' },
        ],
      },
    },
    snack: {
      en: 'Khanom Jeen Nam Ngiao', cn: '鱼丸汤面', story: 'A thin rice noodle soup with a blood-orange broth tinted by dried chillies, fish balls that bounce, pickled mustard greens, and a handful of crispy fried shallots for texture.', kcal: 320, time: '20 min', img: IMGS.khanomJeen, taste: 'Spicy · Sour',
      price: 42, difficulty: 'Medium', macros: { protein: '16g', carbs: '42g', fats: '8g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'rice noodles' },
          { n: '100g', t: 'fish balls' },
          { n: '1 bunch', t: 'mustard greens' },
          { n: '2 tbsp', t: 'fried shallots' },
        ],
        steps: [
          { n: '01', t: 'Make broth', d: 'Simmer tomatoes, chillies, and tamarind 15 minutes.' },
          { n: '02', t: 'Cook noodles', d: 'Soak and cook noodles until tender.' },
          { n: '03', t: 'Add fish balls', d: 'Add fish balls and greens. Simmer 5 minutes.' },
          { n: '04', t: 'Serve', d: 'Ladle into bowl. Top with fried shallots.' },
        ],
      },
    },
    streetFood: {
      en: 'Khanom Bueang', cn: '椰丝煎饼', story: 'A crispy rice crepe, thin as a dragonfly wing, folded in half around sweet coconut cream and a sprinkling of chopped scallion. You buy three, eat two, save one for the walk home.', kcal: 240, time: '10 min', img: IMGS.khanomBueang, taste: 'Sweet · Crispy',
      price: 32, difficulty: 'Easy', macros: { protein: '4g', carbs: '32g', fats: '10g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'rice flour' },
          { n: '2 cups', t: 'coconut milk' },
          { n: '1/2 cup', t: 'sugar' },
          { n: '2 tbsp', t: 'chopped scallion' },
        ],
        steps: [
          { n: '01', t: 'Make batter', d: 'Mix rice flour with coconut milk and sugar.' },
          { n: '02', t: 'Cook crepes', d: 'Pour thin batter on hot griddle. Cook until crispy.' },
          { n: '03', t: 'Fill', d: 'Spread coconut cream. Sprinkle scallion.' },
          { n: '04', t: 'Fold', d: 'Fold in half. Serve immediately.' },
        ],
      },
    },
  },
  china: {
    flag: 'CN', name: 'China', cn: '中国',
    blurb: 'Eight cuisines, one philosophy. China eats with patience, precision, and the belief that food is medicine.',
    breakfast: {
      en: 'Soup Dumplings', cn: '小笼包', story: 'Eighteen pleats. Aspic inside the wrapper that turns to broth when you steam it. You bite a hole, sip the soup, then eat the dumpling whole with ginger vinegar. This is Shanghai — careful, then sudden joy.', kcal: 380, time: '12 min', img: IMGS.xiaolongbao, taste: 'Savoury · Delicate',
      price: 58, difficulty: 'Medium', macros: { protein: '18g', carbs: '48g', fats: '14g' },
      recipe: {
        ingredients: [
          { n: '300g', t: 'ground pork (3:1 fat to lean)' },
          { n: '40', t: 'wonton wrappers' },
          { n: '2 tbsp', t: 'gelatin powder' },
          { n: '1 tbsp', t: 'soy sauce + rice wine' },
        ],
        steps: [
          { n: '01', t: 'Make the aspic', d: 'Dissolve gelatin in hot broth. Set in fridge until firm, then dice.' },
          { n: '02', t: 'Mix the filling', d: 'Combine pork, aspic, soy sauce, rice wine, ginger, and white pepper.' },
          { n: '03', t: 'Fold the dumplings', d: 'Place filling in wrapper. Pleat 18 folds. Steam in bamboo basket.' },
          { n: '04', t: 'Steam', d: 'Steam over boiling water 8 minutes. Serve with black vinegar and julienned ginger.' },
        ],
      },
    },
    lunch: {
      en: 'Kung Pao Chicken', cn: '宫保鸡丁', story: 'Dried red chillies that toast in the wok, Sichuan peppercorns that make your tongue hum, peanuts that stay crunchy. The original palace cook who invented this dish? The Sichuan kitchen has never let him be forgotten.', kcal: 520, time: '20 min', img: IMGS.kungpao, taste: 'Spicy · Sweet',
      price: 78, difficulty: 'Medium', macros: { protein: '32g', carbs: '18g', fats: '28g' },
      recipe: {
        ingredients: [
          { n: '400g', t: 'chicken thigh, cubed' },
          { n: '10', t: 'dried red chillies, cut' },
          { n: '50g', t: 'roasted peanuts' },
          { n: '3', t: 'Sichuan peppercorns' },
        ],
        steps: [
          { n: '01', t: 'Marinate', d: 'Cube chicken. Marinate in soy sauce, rice wine, cornstarch, and sesame oil 15 min.' },
          { n: '02', t: 'Toast aromatics', d: 'Heat oil in wok. Toast peppercorns and chillies until fragrant.' },
          { n: '03', t: 'Stir-fry chicken', d: 'Add chicken. Stir-fry over high heat 3 minutes until golden and nearly cooked.' },
          { n: '04', t: 'Finish', d: 'Add peanuts and sauce (soy, sugar, vinegar). Toss to glaze. Serve over steamed rice.' },
        ],
      },
    },
    dinner: {
      en: 'Peking Duck', cn: '北京烤鸭', story: 'The skin is brushed with maltose, air-dried overnight, roasted until amber, then carved into 108 thin slices. You wrap one skin, one scallion, one cucumber, a swipe of hoisin in a warm pancake. Beijing, perfected.', kcal: 920, time: '90 min', img: IMGS.pekingDuck, taste: 'Crisp · Savoury',
      price: 268, difficulty: 'Advanced', macros: { protein: '58g', carbs: '32g', fats: '52g' },
      recipe: {
        ingredients: [
          { n: '1', t: 'Peking duck (2kg)' },
          { n: '2 tbsp', t: 'honey + vinegar glaze' },
          { n: '12', t: 'mandarin pancakes' },
          { n: '—', t: 'scallion, cucumber, hoisin sauce' },
        ],
        steps: [
          { n: '01', t: 'Marinate the duck', d: 'Rub duck with five-spice powder. Air-dry in fridge 24 hours.' },
          { n: '02', t: 'Glaze', d: 'Apply honey-vinegar glaze. Air-dry 4 hours until skin is glassy.' },
          { n: '03', t: 'Roast', d: 'Roast breast-down at 220°C for 20 min, then breast-up 30 min until skin is amber.' },
          { n: '04', t: 'Carve and serve', d: 'Carve 108 slices. Serve with warm pancakes, scallion, cucumber, and hoisin.' },
        ],
      },
    },
    dessert: {
      en: 'Tangyuan in Osmanthus Syrup', cn: '桂花汤圆', story: 'Glutinous rice balls the colour of pearls, filled with black sesame that oozes, floating in a sweet syrup scented with golden osmanthus. During the Lantern Festival, families sit around a pot of these and call it reunion.', kcal: 340, time: '10 min', img: IMGS.tangyuan, taste: 'Sweet · Floral',
      price: 42, difficulty: 'Easy', macros: { protein: '4g', carbs: '62g', fats: '6g' },
      recipe: {
        ingredients: [
          { n: '200g', t: 'glutinous rice flour' },
          { n: '80g', t: 'black sesame paste, chilled' },
          { n: '2 tbsp', t: 'sugar' },
          { n: '1 tsp', t: 'osmanthus blossom syrup' },
        ],
        steps: [
          { n: '01', t: 'Make the dough', d: 'Mix flour with warm water. Knead into smooth dough. Rest 15 minutes.' },
          { n: '02', t: 'Fill', d: 'Divide dough into 20 pieces. Flatten, place sesame filling, seal and roll into balls.' },
          { n: '03', t: 'Boil', d: 'Bring water to boil. Drop tangyuan. Cook until they float, then 2 more minutes.' },
          { n: '04', t: 'Serve', d: 'Ladle into bowls. Top with osmanthus syrup and a splash of the cooking water.' },
        ],
      },
    },
    snack: {
      en: 'Century Egg Tofu', cn: '皮蛋豆腐', story: 'Silken tofu, cold and wobbly, topped with century egg diced into cubes, chopped cilantro, and a soy-sesame dressing. Beijing summers in one plate.', kcal: 180, time: '10 min', img: IMGS.centuryEggTofu, taste: 'Savory · Silky',
      price: 28, difficulty: 'Easy', macros: { protein: '12g', carbs: '4g', fats: '12g' },
      recipe: {
        ingredients: [
          { n: '1 block', t: 'silken tofu' },
          { n: '2', t: 'century eggs, diced' },
          { n: '2 tbsp', t: 'chopped cilantro' },
          { n: '2 tbsp', t: 'soy-sesame dressing' },
        ],
        steps: [
          { n: '01', t: 'Drain tofu', d: 'Drain tofu and cut into cubes.' },
          { n: '02', t: 'Prepare eggs', d: 'Dice century eggs into small cubes.' },
          { n: '03', t: 'Arrange', d: 'Place tofu on plate. Top with eggs.' },
          { n: '04', t: 'Dress', d: 'Drizzle dressing. Top with cilantro.' },
        ],
      },
    },
    streetFood: {
      en: 'Jianbing', cn: '煎饼', story: 'A thin batter spread on a hot griddle, an egg cracked on top and scraped flat, scallions and cilantro sprinkled, chili sauce brushed, a crispy wonton cracker tucked in, then rolled. Beijing breakfast on the move.', kcal: 360, time: '8 min', img: IMGS.jianbing, taste: 'Crispy · Savory',
      price: 18, difficulty: 'Easy', macros: { protein: '14g', carbs: '42g', fats: '12g' },
      recipe: {
        ingredients: [
          { n: '1 cup', t: 'mung bean batter' },
          { n: '1', t: 'egg' },
          { n: 'fresh', t: 'scallion, cilantro' },
          { n: '1', t: 'wonton cracker' },
        ],
        steps: [
          { n: '01', t: 'Spread batter', d: 'Spread thin layer of batter on hot griddle.' },
          { n: '02', t: 'Add egg', d: 'Crack egg, spread evenly.' },
          { n: '03', t: 'Top', d: 'Add scallion, cilantro, cracker.' },
          { n: '04', t: 'Roll', d: 'Brush sauce. Roll tightly and serve.' },
        ],
      },
    },
  },
}

export const DESTINATIONS = [
  { id: 'italy', en: 'Italy', cn: '意大利', tag: 'La Dolce Vita', img: IMGS.rome },
  { id: 'japan', en: 'Japan', cn: '日本', tag: '静寂の味', img: IMGS.japanStreet },
  { id: 'mexico', en: 'Mexico', cn: '墨西哥', tag: 'Fuego y Sol', img: IMGS.chili },
  { id: 'france', en: 'France', cn: '法国', tag: 'Café Society', img: IMGS.eiffel },
  { id: 'thailand', en: 'Thailand', cn: '泰国', tag: 'เสน่ห์', img: IMGS.thai },
  { id: 'china', en: 'China', cn: '中国', tag: '食为天', img: IMGS.landmarkChina },
]

export const DAILY_HERO_DATA: HeroData[] = [
  {
    dayLabel: 'Monday',
    country: 'italy',
    heroImg: IMGS.landmarkRome,
    featuredMealKey: 'lunch',
    chefMealKey: 'streetFood',
    quote: 'Italy does not serve food. It stages it — slowly, loudly, and always at the right temperature.',
    quoteAuthor: 'Marco Tosi',
    description: 'Taste Rome tonight.',
    latLng: '41.9028° N / 12.4964° E',
    chefName: 'Marco Tosi',
    chefTitle: 'Head Chef · Rome, Est. 1998',
    heroSubtitle: 'Roma · Italia',
  },
  {
    dayLabel: 'Tuesday',
    country: 'japan',
    heroImg: IMGS.landmarkTokyo,
    featuredMealKey: 'lunch',
    chefMealKey: 'streetFood',
    quote: 'In Japan, cooking is a form of listening — to the seasons, to the ingredients, to the diners.',
    quoteAuthor: 'Hiroshi Tanaka',
    description: 'Slurp Tokyo tonight.',
    latLng: '35.6762° N / 139.6503° E',
    chefName: 'Hiroshi Tanaka',
    chefTitle: 'Head Chef · Tokyo, Est. 2005',
    heroSubtitle: 'Tōkyō · 日本',
  },
  {
    dayLabel: 'Wednesday',
    country: 'mexico',
    heroImg: IMGS.landmarkMexico,
    featuredMealKey: 'lunch',
    chefMealKey: 'streetFood',
    quote: 'Mexico eats out loud — with lime, with chilli, with fire. Every meal is a small celebration.',
    quoteAuthor: 'Ana Herrera',
    description: 'Saborea México esta noche.',
    latLng: '19.4326° N / 99.1332° W',
    chefName: 'Ana Herrera',
    chefTitle: 'Head Chef · Oaxaca, Est. 2002',
    heroSubtitle: 'Ciudad de México · México',
  },
  {
    dayLabel: 'Thursday',
    country: 'france',
    heroImg: IMGS.eiffel,
    featuredMealKey: 'dinner',
    chefMealKey: 'streetFood',
    quote: 'The French eat with patience. They drink with conviction. They live with butter.',
    quoteAuthor: 'Pierre Laurent',
    description: 'Dînez à Paris ce soir.',
    latLng: '48.8566° N / 2.3522° E',
    chefName: 'Pierre Laurent',
    chefTitle: 'Head Chef · Paris, Est. 2001',
    heroSubtitle: 'Paris · France',
  },
  {
    dayLabel: 'Friday',
    country: 'thailand',
    heroImg: IMGS.landmarkBangkok,
    featuredMealKey: 'lunch',
    chefMealKey: 'streetFood',
    quote: 'Thailand balances four flavors in every bowl — sweet, sour, salty, and the ghost of chilli heat.',
    quoteAuthor: 'Somchai Srisuk',
    description: 'ลิ้มรสไทยคืนนี้.',
    latLng: '13.7563° N / 100.5018° E',
    chefName: 'Somchai Srisuk',
    chefTitle: 'Head Chef · Bangkok, Est. 2003',
    heroSubtitle: 'กรุงเทพฯ · ไทย',
  },
  {
    dayLabel: 'Saturday',
    country: 'china',
    heroImg: IMGS.landmarkChina,
    featuredMealKey: 'lunch',
    chefMealKey: 'streetFood',
    quote: '食为天 — In China, food is not sustenance. It is heaven.',
    quoteAuthor: 'Lau Wei',
    description: 'Saturday in China.',
    latLng: '35.8617° N / 104.1954° E',
    chefName: 'Lau Wei',
    chefTitle: 'Head Chef · Sichuan, Est. 1985',
    heroSubtitle: 'Zhōngguó · 中国',
  },
  {
    dayLabel: 'Sunday',
    country: 'china',
    heroImg: IMGS.landmarkChina,
    featuredMealKey: 'dinner',
    chefMealKey: 'snack',
    quote: 'A meal is not a meal in China. It is a dialogue — between regions, generations, and the seasons.',
    quoteAuthor: 'Chen Shu',
    chefName: 'Chen Shu',
    chefTitle: 'Head Chef · Jiangnan, Est. 2005',
    description: 'Sunday in China.',
    latLng: '30.5728° N / 104.0668° E',
    heroSubtitle: 'Zhōngguó · 中国',
  },
]

export function getDailyHeroData(date: Date = new Date()): HeroData {
  const day = date.getDay()
  const idx = day === 0 ? 6 : day - 1
  return DAILY_HERO_DATA[idx]
}

export type { Screen, NavScreen, Country, MealKey, Meal, CountryData, HeroData, IconProps }
