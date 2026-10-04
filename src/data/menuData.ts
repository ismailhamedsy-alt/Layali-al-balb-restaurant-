import { MenuItem, RestaurantConfig } from '../types/menu';
import heroImg from '../assets/images/layali_albab_hero_1790708328731.jpg';
import broastedImg from '../assets/images/broasted_crispy_1790708355370.jpg';
import escalopeImg from '../assets/images/escalope_arabi_dish_1790755446057.jpg';

export { heroImg, broastedImg, escalopeImg };

// Authentic Meal Images served reliably from /images/meals/
export const REAL_AL_DEMASHKI_IMAGES = {
  escalopeMeal: '/images/meals/escalope_meal.jpg',
  crispyMeal: '/images/meals/crispy_meal.jpg',
  crispyHalf: '/images/meals/crispy_half.jpg',
  zingerMeal: '/images/meals/zinger_meal.jpg',
  zingerSandwich: '/images/meals/zinger_sandwich.jpg',
  zingerSamoon: '/images/meals/zinger_samoon.jpg',
  spicyHalf: '/images/meals/spicy_half.jpg',
  supremeSamoon: '/images/meals/supreme_samoon.jpg',
  burger: '/images/meals/burger.jpg',
  shawarmaSandwich: '/images/meals/shawarma_sandwich.jpg',
  shawarmaSamoon: '/images/meals/shawarma_samoon.jpg',
  katubiyaShawarma: '/images/meals/katubiya_shawarma.jpg',
  shawarmaHalfKg: '/images/meals/shawarma_half_kg.jpg',
  shawarmaQuarterKg: '/images/meals/shawarma_quarter_kg.jpg',
  meatKebabKg: '/images/meals/meat_kebab_kg.jpg',
  meatKebabHalfKg: '/images/meals/meat_kebab_half_kg.jpg',
  meatSteaksKg: '/images/meals/meat_steaks_kg.jpg',
  kastaBbqKg: '/images/meals/kasta_bbq_kg.jpg',
  chickenKebabHalfKg: '/images/meals/chicken_kebab_half_kg.jpg',
  shishChickenHalfKg: '/images/meals/shish_chicken_half_kg.jpg',
  chickenWingsHalfKg: '/images/meals/chicken_wings_half_kg.jpg',
  chickenKebabSandwich: '/images/meals/chicken_kebab_sandwich.jpg',
  shishSandwich: '/images/meals/shish_sandwich.jpg',
  grilledChicken: '/images/meals/grilled_chicken.jpg',
  chickenWithRice: '/images/meals/chicken_with_rice.jpg',
  mandiRiceHalfKg: '/images/meals/mandi_rice_half_kg.jpg',
  marinaChicken: '/images/meals/marina_chicken.jpg',
  marinaMeat: '/images/meals/marina_meat.jpg',
  potatoSandwich: '/images/meals/potato_sandwich.jpg',
  potatoSamoon: '/images/meals/potato_samoon.jpg',
  potatoExtraSamoon: '/images/meals/potato_extra_samoon.jpg',
  friesMeal: '/images/meals/fries_meal.jpg',
  friesLarge: '/images/meals/fries_large.jpg',
  chickenFries: '/images/meals/chicken_fries.jpg',
  chickenFriesLarge: '/images/meals/chicken_fries_large.jpg',
  friedKibbeh: '/images/meals/fried_kibbeh.jpg',
  colaLiter: '/images/meals/cola_liter.jpg',
  kinzaCan: '/images/meals/kinza_can.jpg',
  ayran: '/images/meals/ayran.jpg',
  breadSamoon: '/images/meals/bread_samoon.jpg',
};

export const DEFAULT_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'مطعم ليالي الباب',
  subtitle: 'أشهى الوجبات الغربية، الشاورما، المشاوي والفروج المشوي في مدينة الباب',
  city: 'مدينة الباب',
  whatsappNumber: '352681537243',
  secondaryPhone: '+352681537243',
  address: 'مدينة الباب - الشارع العام',
  openingHours: 'يومياً من 11:00 صباحاً حتى 2:00 بعد منتصف الليل',
  usdRate: 34.5,
  sypRate: 450,
  deliveryFeeTRY: 10,
  isRestaurantOpen: true,
  freeDeliveryThresholdTRY: 0,
  minOrderAmountTRY: 40,
  deliveryAreas: [
    'دوار السنتر / وسط المدينة',
    'سوق الهال والمحلق',
    'شارع زمزم الرئيسي',
    'حي الكواشف الشرقي',
    'حي الكواشف الغربي',
    'طريق الراعي',
    'حي الغربية / جامع فاطمة الزهراء',
    'حي الشمالية / طريق بزاعة',
    'حي القبلية / طريق تادف',
    'دوار الجحجاح',
    'منطقة المشفى الوطني',
    'دوار الشهداء',
    'أخرى (يرجى كتابة العنوان بالتفصيل)',
  ],
};

export const AL_BAB_AREAS = DEFAULT_RESTAURANT_CONFIG.deliveryAreas || [];

export const CATEGORIES = [
  { id: 'all', name: 'الكل بالترتيب', icon: '🍽️' },
  { id: 'western', name: 'وجبات وسندويش غربي', icon: '🥪' },
  { id: 'shawarma', name: 'شاورما على أصولها', icon: '🌯' },
  { id: 'grills_chicken', name: 'مشاوي وفروج ومندي', icon: '🍗' },
  { id: 'sides', name: 'بطاطا وسناك ومقبلات', icon: '🍟' },
  { id: 'drinks_bread', name: 'مشروبات وصمون', icon: '🥤' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    "id": "item-1",
    "name": "وجبة سكلوب",
    "category": "western",
    "description": "وجبة سكلوب صدر دجاج مقرمش شهي ومقلي بالخلطة الخاصة، يقدم مع أصابع البطاطا، صوص الثومية والمخلل والخبز.",
    "priceTRY": 240,
    "image": "/images/meals/escalope_meal.jpg",
    "badge": "الأكثر طلباً ⭐",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-2",
    "name": "وجبة كرسبي",
    "category": "western",
    "description": "وجبة أصابع دجاج كرسبي مقرمشة ذهبية مع صوص الكوكتيل، الثومية، البطاطا الفريت والمخلل.",
    "priceTRY": 240,
    "image": "/images/meals/crispy_meal.jpg",
    "badge": "كرسبي مقرمش 🔥",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-3",
    "name": "نصف وجبة كريسبي",
    "category": "western",
    "description": "نصف وجبة كريسبي دجاج مقرمش تكفي لشخص مع البطاطا المقلية وصلصة الثومية والمخلل.",
    "priceTRY": 145,
    "image": "/images/meals/crispy_half.jpg",
    "available": true
  },
  {
    "id": "item-4",
    "name": "وجبة زنجر",
    "category": "western",
    "description": "وجبة دجاج زنجر مقلي حار سبايسي مع البطاطا الفريت، صلصة الثوم، المخلل وصوص الزنجر الحار.",
    "priceTRY": 260,
    "image": "/images/meals/zinger_meal.jpg",
    "badge": "حار سبايسي 🌶️",
    "isSpicy": true,
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-5",
    "name": "زنجر عادي",
    "category": "western",
    "description": "سندويشة دجاج زنجر مقرمش حار مع المايونيز والجبنة والخس في خبز الصاج المحمص.",
    "priceTRY": 130,
    "image": "/images/meals/zinger_sandwich.jpg",
    "isSpicy": true,
    "available": true
  },
  {
    "id": "item-6",
    "name": "زنجر صمون",
    "category": "western",
    "description": "سندويشة زنجر دجاج حار مقرمش في خبز الصمون الفرنسي الطازج مع الجبنة الذائبة والصوص.",
    "priceTRY": 160,
    "image": "/images/meals/zinger_samoon.jpg",
    "isSpicy": true,
    "badge": "خبز صمون 🥖",
    "available": true
  },
  {
    "id": "item-7",
    "name": "نصف وجبة سبايسي",
    "category": "western",
    "description": "نصف وجبة دجاج حار سبايسي مقرمش مع البطاطا المقلية والثومية.",
    "priceTRY": 145,
    "image": "/images/meals/spicy_half.jpg",
    "isSpicy": true,
    "available": true
  },
  {
    "id": "item-8",
    "name": "سوبريم صمون",
    "category": "western",
    "description": "سندويشة سوبريم دجاج فاخرة في خبز الصمون مع الجبنة والصوصات الخاصة والخضار.",
    "priceTRY": 160,
    "image": "/images/meals/supreme_samoon.jpg",
    "badge": "سوبريم مميز ✨",
    "available": true
  },
  {
    "id": "item-9",
    "name": "صمون برغر",
    "category": "western",
    "description": "همبرغر شهي في خبز البرغر مع شريحة اللحم أو الدجاج والجبنة والخس والصوص.",
    "priceTRY": 10,
    "image": "/images/meals/burger.jpg",
    "available": true
  },
  {
    "id": "item-10",
    "name": "شاورما عادي",
    "category": "shawarma",
    "description": "سندويشة شاورما دجاج سورية أصلية ملفوفة بالخبز السوري ومحمصة على الجريل مع الثومية والمخلل.",
    "priceTRY": 80,
    "image": "/images/meals/shawarma_sandwich.jpg",
    "badge": "شاورما على أصولها 🌯",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-11",
    "name": "شاورما صمون",
    "category": "shawarma",
    "description": "شاورما دجاج متبلة في خبز الصمون الطازج مع الثومية والمخلل والبطاطا.",
    "priceTRY": 110,
    "image": "/images/meals/shawarma_samoon.jpg",
    "available": true
  },
  {
    "id": "item-12",
    "name": "كتوبية شاورما",
    "category": "shawarma",
    "description": "كتوبية شاورما سريعة ولذيذة محشوة بشرائح الشاورما الساخنة.",
    "priceTRY": 30,
    "image": "/images/meals/katubiya_shawarma.jpg",
    "available": true
  },
  {
    "id": "item-13",
    "name": "شاورما فرط نصف كيلو",
    "category": "shawarma",
    "description": "نصف كيلو شاورما دجاج صافية متبلة على السيخ، تقدم مع كريم الثوم، المخلل والخبز الساخن والسرفيس.",
    "priceTRY": 380,
    "image": "/images/meals/shawarma_half_kg.jpg",
    "badge": "عائلي 🍗",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-14",
    "name": "شاورما فرط ربع كيلو",
    "category": "shawarma",
    "description": "ربع كيلو شاورما دجاج سيخ شهية مع الثومية، المخلل والخبز الطازج.",
    "priceTRY": 190,
    "image": "/images/meals/shawarma_quarter_kg.jpg",
    "available": true
  },
  {
    "id": "item-15",
    "name": "كباب غنم كيلو",
    "category": "grills_chicken",
    "description": "كيلو كامل من كباب لحم الغنم البلدي المشوي على الفحم، يقدم مع البيواز، البقدونس، الطماطم والخبز المشوي.",
    "priceTRY": 950,
    "image": "/images/meals/meat_kebab_kg.jpg",
    "badge": "لحم غنم بلدي 🥩",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-16",
    "name": "نصف كيلو كباب غنم",
    "category": "grills_chicken",
    "description": "نصف كيلو كباب لحم غنم مشوي على الفحم مع البصل بالسماق والطماطم المشوية والخبز.",
    "priceTRY": 475,
    "image": "/images/meals/meat_kebab_half_kg.jpg",
    "available": true
  },
  {
    "id": "item-17",
    "name": "شقق غنم كيلو",
    "category": "grills_chicken",
    "description": "كيلو شقق لحم غنم بلدي طري مشوي على الفحم مع السرفيس والخبز الشامي الساخن.",
    "priceTRY": 1000,
    "image": "/images/meals/meat_steaks_kg.jpg",
    "badge": "فاخر ملكي 👑",
    "available": true
  },
  {
    "id": "item-18",
    "name": "كيلو كستا مشوي",
    "category": "grills_chicken",
    "description": "كيلو كستا مشوي متبل على الفحم بنكهة شهية وطرية.",
    "priceTRY": 360,
    "image": "/images/meals/kasta_bbq_kg.jpg",
    "available": true
  },
  {
    "id": "item-19",
    "name": "كباب الدجاج نصف كيلو",
    "category": "grills_chicken",
    "description": "نصف كيلو كباب دجاج مفروم مع التتبيلة الخاصة مشوي على الفحم مع السرفيس والثومية.",
    "priceTRY": 180,
    "image": "/images/meals/chicken_kebab_half_kg.jpg",
    "available": true
  },
  {
    "id": "item-20",
    "name": "شيش دجاج نصف كيلو",
    "category": "grills_chicken",
    "description": "نصف كيلو شيش طاووق صدور دجاج متبلة ومشوية على الفحم مع صوص الثومية والبطاطا.",
    "priceTRY": 190,
    "image": "/images/meals/shish_chicken_half_kg.jpg",
    "available": true
  },
  {
    "id": "item-21",
    "name": "جناح نصف كيلو",
    "category": "grills_chicken",
    "description": "نصف كيلو جوانح دجاج متبلة بخلطة الشواء ومحمرة على الفحم.",
    "priceTRY": 180,
    "image": "/images/meals/chicken_wings_half_kg.jpg",
    "available": true
  },
  {
    "id": "item-22",
    "name": "سندويش كباب دجاج دبل",
    "category": "grills_chicken",
    "description": "سندويش كباب دجاج مشوي بحشوة مضاعفة دبل مع الثوم والمخلل في خبز الصاج المحمص.",
    "priceTRY": 100,
    "image": "/images/meals/chicken_kebab_sandwich.jpg",
    "available": true
  },
  {
    "id": "item-23",
    "name": "سندويش شيش دبل",
    "category": "grills_chicken",
    "description": "سندويش شيش طاووق دجاج مشوي دبل بالخبز السوري مع الثوم والمخلل المحمص.",
    "priceTRY": 150,
    "image": "/images/meals/shish_sandwich.jpg",
    "available": true
  },
  {
    "id": "item-24",
    "name": "فروج مشوي",
    "category": "grills_chicken",
    "description": "فروج كامل متبل ومشوي على الفحم أو الشواية، محمر ومقرمش مع علب الثومية والمخلل والخبز.",
    "priceTRY": 450,
    "image": "/images/meals/grilled_chicken.jpg",
    "badge": "فروج كامل مشوي 🍗",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-25",
    "name": "فروج مع كيلو رز",
    "category": "grills_chicken",
    "description": "فروج مشوي كامل يقدم مع كيلو رز مندي مفلفل ومبهر بالمكسرات والخلطة مع الصلصات.",
    "priceTRY": 510,
    "image": "/images/meals/chicken_with_rice.jpg",
    "badge": "وليمة عائلية 👨‍👩‍👧‍👦",
    "isPopular": true,
    "available": true
  },
  {
    "id": "item-26",
    "name": "رز مندي نصف كيلو",
    "category": "grills_chicken",
    "description": "نصف كيلو رز مندي طويل الحبة مطبوخ بنكهة البهارات الشامية والزعفران.",
    "priceTRY": 50,
    "image": "/images/meals/mandi_rice_half_kg.jpg",
    "available": true
  },
  {
    "id": "item-27",
    "name": "مارينا مد دجاج",
    "category": "grills_chicken",
    "description": "مارينا دجاج مد محمصة وغنية بالنكهة والمقبلات.",
    "priceTRY": 90,
    "image": "/images/meals/marina_chicken.jpg",
    "available": true
  },
  {
    "id": "item-28",
    "name": "مارينا مد غنم",
    "category": "grills_chicken",
    "description": "مارينا لحم غنم بلدي مد مشوية مع بهارات المارينا والخبز المحمص.",
    "priceTRY": 150,
    "image": "/images/meals/marina_meat.jpg",
    "available": true
  },
  {
    "id": "item-29",
    "name": "بطاطا عادي",
    "category": "sides",
    "description": "سندويشة بطاطا مقلية بالخبز السوري المحمص مع الثومية، الكاتشب والمخلل المقرمش.",
    "priceTRY": 50,
    "image": "/images/meals/potato_sandwich.jpg",
    "available": true
  },
  {
    "id": "item-30",
    "name": "بطاطا صمون",
    "category": "sides",
    "description": "سندويشة بطاطا مقلية في خبز الصمون الفرنسي مع كريم الثوم والكاتشب.",
    "priceTRY": 60,
    "image": "/images/meals/potato_samoon.jpg",
    "available": true
  },
  {
    "id": "item-31",
    "name": "بطاطا اكسترا صمون",
    "category": "sides",
    "description": "سندويشة بطاطا صمون بحشوة إضافية اكسترا غنية بالجبنة والثومية.",
    "priceTRY": 80,
    "image": "/images/meals/potato_extra_samoon.jpg",
    "available": true
  },
  {
    "id": "item-32",
    "name": "وجبة بطاطا فريت",
    "category": "sides",
    "description": "صحن وجبة بطاطا مقلية ذهبية مقرمشة تكفي لشخص مع بهارات البطاطا الخاصة والثومية.",
    "priceTRY": 40,
    "image": "/images/meals/fries_meal.jpg",
    "available": true
  },
  {
    "id": "item-33",
    "name": "وجبة بطاطا حجم كبير",
    "category": "sides",
    "description": "صحن بطاطا فريت عائلي كبير ومقرمش يكفي عدة أشخاص مع كريم الثوم والكاتشب.",
    "priceTRY": 90,
    "image": "/images/meals/fries_large.jpg",
    "badge": "حجم كبير 🍟",
    "available": true
  },
  {
    "id": "item-34",
    "name": "تشكن فرايز عادي",
    "category": "sides",
    "description": "أصابع تشكن فرايز مقرمشة ومتبلة مع البطاطا المقلية وصوص الجبنة والثومية.",
    "priceTRY": 100,
    "image": "/images/meals/chicken_fries.jpg",
    "available": true
  },
  {
    "id": "item-35",
    "name": "تشكن فرايز كبير",
    "category": "sides",
    "description": "صحن تشكن فرايز دجاج حجم كبير غني بالقطع المقرمشة والجبنة الذائبة والصوصات.",
    "priceTRY": 180,
    "image": "/images/meals/chicken_fries_large.jpg",
    "badge": "تشكن فرايز كبير 🚀",
    "available": true
  },
  {
    "id": "item-36",
    "name": "كبة مقلية بالدجاج",
    "category": "sides",
    "description": "حبة كبة مقلية مقرمشة محشوة بلحم الدجاج المتبل والمكسرات.",
    "priceTRY": 25,
    "image": "/images/meals/fried_kibbeh.jpg",
    "available": true
  },
  {
    "id": "item-37",
    "name": "كولا لتر",
    "category": "drinks_bread",
    "description": "قنينة كوكاكولا أو بيبسي باردة منعشة حجم عائلي 1 لتر.",
    "priceTRY": 45,
    "image": "/images/meals/cola_liter.jpg",
    "available": true
  },
  {
    "id": "item-38",
    "name": "كينزا تنك",
    "category": "drinks_bread",
    "description": "علبة كانز كينزا غازية باردة ومنعشة بمختلف النكهات (كولا، حمضيات، برتقال).",
    "priceTRY": 25,
    "image": "/images/meals/kinza_can.jpg",
    "available": true
  },
  {
    "id": "item-39",
    "name": "لبن عيران",
    "category": "drinks_bread",
    "description": "كوب لبن عيران طازج وبارد منعش مع رشة نعناع.",
    "priceTRY": 15,
    "image": "/images/meals/ayran.jpg",
    "available": true
  },
  {
    "id": "item-40",
    "name": "صمون فارغ",
    "category": "drinks_bread",
    "description": "خبز صمون فرنسي طازج وهش بالسمسم.",
    "priceTRY": 15,
    "image": "/images/meals/bread_samoon.jpg",
    "available": true
  }
];
