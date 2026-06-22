export interface Alimento {
  id: string;
  nombre: string;
  categoria: string;
  icon: string;
  porcion: string;
  kcal: number;
  proteina: number;
  carbs: number;
  grasas: number;
}

export const ALIMENTOS: Alimento[] = [
  // Proteínas animales
  { id: 'huevo',       nombre: 'Huevo entero',          categoria: 'Proteínas', icon: '🥚', porcion: '1 unidad (55 g)',    kcal: 79,  proteina: 6.1, carbs: 0.6, grasas: 5.3 },
  { id: 'clara',       nombre: 'Clara de huevo',         categoria: 'Proteínas', icon: '🥚', porcion: '1 unidad (33 g)',    kcal: 17,  proteina: 3.6, carbs: 0.2, grasas: 0   },
  { id: 'pollo',       nombre: 'Pechuga de pollo',       categoria: 'Proteínas', icon: '🍗', porcion: '100 g',              kcal: 165, proteina: 31,  carbs: 0,   grasas: 3.6 },
  { id: 'pavo',        nombre: 'Pechuga de pavo',        categoria: 'Proteínas', icon: '🍗', porcion: '100 g',              kcal: 135, proteina: 30,  carbs: 0,   grasas: 1   },
  { id: 'pescado',     nombre: 'Pescado (bonito/jurel)', categoria: 'Proteínas', icon: '🐟', porcion: '100 g',              kcal: 130, proteina: 22,  carbs: 0,   grasas: 4.5 },
  { id: 'atun',        nombre: 'Atún en agua',           categoria: 'Proteínas', icon: '🥫', porcion: '1 lata (80 g)',      kcal: 88,  proteina: 19,  carbs: 0,   grasas: 0.6 },
  { id: 'carne',       nombre: 'Carne de res magra',     categoria: 'Proteínas', icon: '🥩', porcion: '100 g',              kcal: 180, proteina: 27,  carbs: 0,   grasas: 7.5 },
  { id: 'mondongo',    nombre: 'Mondongo (cau cau)',      categoria: 'Proteínas', icon: '🍲', porcion: '100 g',              kcal: 120, proteina: 14,  carbs: 3,   grasas: 6   },
  // Lácteos
  { id: 'yogur',       nombre: 'Yogur griego natural',   categoria: 'Lácteos',   icon: '🥛', porcion: '100 g',              kcal: 59,  proteina: 10,  carbs: 3.6, grasas: 0.4 },
  { id: 'kefir',       nombre: 'Kéfir natural',          categoria: 'Lácteos',   icon: '🥛', porcion: '200 ml',             kcal: 60,  proteina: 6,   carbs: 8,   grasas: 1   },
  { id: 'cottage',     nombre: 'Queso cottage',          categoria: 'Lácteos',   icon: '🧀', porcion: '100 g',              kcal: 98,  proteina: 12,  carbs: 3.4, grasas: 4.3 },
  { id: 'leche',       nombre: 'Leche entera',           categoria: 'Lácteos',   icon: '🥛', porcion: '200 ml',             kcal: 122, proteina: 6.4, carbs: 9.4, grasas: 6.4 },
  // Carbohidratos
  { id: 'avena',       nombre: 'Avena en hojuelas',      categoria: 'Carbos',    icon: '🌾', porcion: '40 g seco',          kcal: 148, proteina: 5.6, carbs: 25,  grasas: 2.6 },
  { id: 'quinua',      nombre: 'Quinua cocida',          categoria: 'Carbos',    icon: '🌾', porcion: '½ taza (90 g)',       kcal: 111, proteina: 4,   carbs: 20,  grasas: 1.8 },
  { id: 'arroz',       nombre: 'Arroz blanco cocido',    categoria: 'Carbos',    icon: '🍚', porcion: '½ taza (90 g)',       kcal: 117, proteina: 2.4, carbs: 26,  grasas: 0.2 },
  { id: 'arroz-int',   nombre: 'Arroz integral cocido',  categoria: 'Carbos',    icon: '🍚', porcion: '½ taza (90 g)',       kcal: 108, proteina: 2.5, carbs: 22,  grasas: 0.9 },
  { id: 'camote',      nombre: 'Camote sancochado',      categoria: 'Carbos',    icon: '🍠', porcion: '100 g',              kcal: 86,  proteina: 1.6, carbs: 20,  grasas: 0.1 },
  { id: 'papa',        nombre: 'Papa sancochada',        categoria: 'Carbos',    icon: '🥔', porcion: '100 g',              kcal: 77,  proteina: 2,   carbs: 17,  grasas: 0.1 },
  { id: 'tostada',     nombre: 'Tostada integral',       categoria: 'Carbos',    icon: '🍞', porcion: '1 unidad (30 g)',    kcal: 81,  proteina: 3.5, carbs: 15,  grasas: 0.9 },
  { id: 'tortilla',    nombre: 'Tortilla integral',      categoria: 'Carbos',    icon: '🫓', porcion: '1 unidad (40 g)',    kcal: 120, proteina: 3,   carbs: 22,  grasas: 2.5 },
  { id: 'datiles',     nombre: 'Dátiles',                categoria: 'Carbos',    icon: '🌴', porcion: '3 unidades (24 g)', kcal: 66,  proteina: 0.6, carbs: 18,  grasas: 0.1 },
  // Frutas
  { id: 'platano',     nombre: 'Plátano',                categoria: 'Frutas',    icon: '🍌', porcion: '1 mediano (100 g)', kcal: 89,  proteina: 1.1, carbs: 23,  grasas: 0.3 },
  { id: 'fresas',      nombre: 'Fresas',                 categoria: 'Frutas',    icon: '🍓', porcion: '100 g',              kcal: 32,  proteina: 0.7, carbs: 7.7, grasas: 0.3 },
  { id: 'pina',        nombre: 'Piña',                   categoria: 'Frutas',    icon: '🍍', porcion: '1 taza (170 g)',     kcal: 85,  proteina: 0.9, carbs: 22,  grasas: 0.2 },
  { id: 'manzana',     nombre: 'Manzana',                categoria: 'Frutas',    icon: '🍎', porcion: '1 mediana (150 g)', kcal: 78,  proteina: 0.4, carbs: 21,  grasas: 0.2 },
  { id: 'naranja',     nombre: 'Naranja',                categoria: 'Frutas',    icon: '🍊', porcion: '1 unidad (130 g)',  kcal: 61,  proteina: 1.2, carbs: 15,  grasas: 0.2 },
  { id: 'uva',         nombre: 'Uvas',                   categoria: 'Frutas',    icon: '🍇', porcion: '100 g',              kcal: 69,  proteina: 0.7, carbs: 18,  grasas: 0.2 },
  // Verduras
  { id: 'espinaca',    nombre: 'Espinaca',               categoria: 'Verduras',  icon: '🥬', porcion: '100 g',              kcal: 23,  proteina: 2.9, carbs: 3.6, grasas: 0.4 },
  { id: 'lechuga',     nombre: 'Lechuga',                categoria: 'Verduras',  icon: '🥗', porcion: '100 g',              kcal: 15,  proteina: 1.4, carbs: 2.9, grasas: 0.2 },
  { id: 'tomate',      nombre: 'Tomate cherry',          categoria: 'Verduras',  icon: '🍅', porcion: '100 g',              kcal: 18,  proteina: 0.9, carbs: 3.9, grasas: 0.2 },
  { id: 'zanahoria',   nombre: 'Zanahoria baby',         categoria: 'Verduras',  icon: '🥕', porcion: '100 g',              kcal: 41,  proteina: 0.9, carbs: 10,  grasas: 0.2 },
  { id: 'pimiento',    nombre: 'Pimiento',               categoria: 'Verduras',  icon: '🫑', porcion: '100 g',              kcal: 31,  proteina: 1,   carbs: 7.3, grasas: 0.3 },
  { id: 'cebolla',     nombre: 'Cebolla',                categoria: 'Verduras',  icon: '🧅', porcion: '100 g',              kcal: 40,  proteina: 1.1, carbs: 9.3, grasas: 0.1 },
  { id: 'brocoli',     nombre: 'Brócoli',                categoria: 'Verduras',  icon: '🥦', porcion: '100 g',              kcal: 34,  proteina: 2.8, carbs: 7,   grasas: 0.4 },
  // Grasas saludables
  { id: 'palta',       nombre: 'Palta / Aguacate',       categoria: 'Grasas',    icon: '🥑', porcion: '½ unidad (70 g)',    kcal: 113, proteina: 1.4, carbs: 2.5, grasas: 11  },
  { id: 'nueces',      nombre: 'Nueces',                 categoria: 'Grasas',    icon: '🌰', porcion: '30 g',               kcal: 196, proteina: 4.6, carbs: 4.1, grasas: 19.6},
  { id: 'almendras',   nombre: 'Almendras',              categoria: 'Grasas',    icon: '🌰', porcion: '30 g',               kcal: 173, proteina: 6,   carbs: 6.3, grasas: 15  },
  { id: 'aceite',      nombre: 'Aceite de oliva',        categoria: 'Grasas',    icon: '🫙', porcion: '1 cdta (5 ml)',      kcal: 44,  proteina: 0,   carbs: 0,   grasas: 5   },
  { id: 'chia',        nombre: 'Chía',                   categoria: 'Grasas',    icon: '🌱', porcion: '1 cdta (10 g)',      kcal: 49,  proteina: 1.7, carbs: 4.2, grasas: 3.1 },
  { id: 'linaza',      nombre: 'Linaza',                 categoria: 'Grasas',    icon: '🌱', porcion: '1 cdta (10 g)',      kcal: 55,  proteina: 1.9, carbs: 3,   grasas: 4.3 },
  // Legumbres
  { id: 'lentejas',    nombre: 'Lentejas cocidas',       categoria: 'Legumbres', icon: '🫘', porcion: '½ taza (100 g)',     kcal: 116, proteina: 9,   carbs: 20,  grasas: 0.4 },
  { id: 'frijoles',    nombre: 'Frijoles cocidos',       categoria: 'Legumbres', icon: '🫘', porcion: '½ taza (100 g)',     kcal: 132, proteina: 8.7, carbs: 23.7,grasas: 0.5 },
  { id: 'hummus',      nombre: 'Hummus',                 categoria: 'Legumbres', icon: '🥙', porcion: '2 cdas (30 g)',      kcal: 70,  proteina: 2,   carbs: 6,   grasas: 4.5 },
  // Otros
  { id: 'chocolate',   nombre: 'Chocolate 70%',          categoria: 'Otros',     icon: '🍫', porcion: '20 g',               kcal: 117, proteina: 1.8, carbs: 8.5, grasas: 8.7 },
  { id: 'proteina-p',  nombre: 'Proteína en polvo',      categoria: 'Otros',     icon: '💪', porcion: '1 scoop (30 g)',     kcal: 120, proteina: 24,  carbs: 3,   grasas: 1.5 },
  { id: 'guacamole',   nombre: 'Guacamole',              categoria: 'Otros',     icon: '🥑', porcion: '2 cdas (30 g)',      kcal: 48,  proteina: 0.5, carbs: 2.5, grasas: 4.5 },
  { id: 'canela',      nombre: 'Canela',                 categoria: 'Otros',     icon: '🌿', porcion: '1 cdta (2 g)',       kcal: 6,   proteina: 0.1, carbs: 1.9, grasas: 0   },
];

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function buscarAlimento(query: string): Alimento[] {
  if (!query.trim()) return ALIMENTOS;
  const q = normalize(query);
  return ALIMENTOS.filter((a) =>
    normalize(a.nombre).includes(q) || normalize(a.categoria).includes(q)
  );
}
