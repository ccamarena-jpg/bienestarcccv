export type ProteinaPorComida = {
  preEntreno: number;
  desayuno: number;
  mediaManana: number;
  almuerzo: number;
  snackTarde: number;
  cena: number;
};

export type DiaMenu = {
  dia: string;
  tipo: string;
  preEntreno: string;
  desayuno: string;
  mediaManana: string;
  almuerzo: string;
  snackTarde: string;
  cena: string;
  proteinaEstimada: number;
  proteinaPorComida: ProteinaPorComida;
};

// Índice 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
export const MENU_SEMANAL: DiaMenu[] = [
  {
    dia: 'Domingo',
    tipo: 'Descanso total',
    preEntreno: '—',
    desayuno: 'Huevos + palta + tomate cherry + tostada integral',
    mediaManana: 'Fruta + yogur griego',
    almuerzo: 'Libre familiar consciente: agregar ensalada y priorizar proteína',
    snackTarde: 'Chocolate 70% o zanahorias + guacamole',
    cena: 'Cena ligera: cottage + tostadas integrales + crema de espinaca',
    proteinaEstimada: 88,
    proteinaPorComida: { preEntreno: 0, desayuno: 22, mediaManana: 12, almuerzo: 33, snackTarde: 4, cena: 17 },
  },
  {
    dia: 'Lunes',
    tipo: 'Descanso activo',
    preEntreno: '—',
    desayuno: 'Kéfir 200 ml + tostada integral con huevo, palta y tomate cherry',
    mediaManana: 'Yogur griego + fresas + chía',
    almuerzo: 'Arroz con pollo: más pollo, menos arroz, ensalada de lechuga/pimiento',
    snackTarde: 'Cottage + zanahorias baby',
    cena: 'Tortilla de espinaca, cebolla y pimiento',
    proteinaEstimada: 90,
    proteinaPorComida: { preEntreno: 0, desayuno: 24, mediaManana: 11, almuerzo: 32, snackTarde: 14, cena: 12 },
  },
  {
    dia: 'Martes',
    tipo: 'GYM A · Pierna + glúteo',
    preEntreno: '½ plátano + agua',
    desayuno: 'Omelette 2 huevos + espinaca + cottage + fresas',
    mediaManana: 'Kéfir + piña',
    almuerzo: 'Estofado de pollo + ½ taza arroz/quinua + ensalada',
    snackTarde: 'Tomate cherry + cottage',
    cena: 'Pescado a la plancha + verduras',
    proteinaEstimada: 98,
    proteinaPorComida: { preEntreno: 1, desayuno: 28, mediaManana: 7, almuerzo: 34, snackTarde: 12, cena: 22 },
  },
  {
    dia: 'Miércoles',
    tipo: 'Opcional Barre/Pilates',
    preEntreno: 'Yogur griego pequeño o fruta',
    desayuno: 'Avena + yogur griego + linaza + plátano',
    mediaManana: 'Zanahoria baby + hummus',
    almuerzo: 'Seco de carne/pollo + menestra + ensalada',
    snackTarde: 'Kéfir + fresas',
    cena: 'Crema de verduras + pollo desmenuzado',
    proteinaEstimada: 92,
    proteinaPorComida: { preEntreno: 8, desayuno: 14, mediaManana: 4, almuerzo: 36, snackTarde: 7, cena: 23 },
  },
  {
    dia: 'Jueves',
    tipo: 'Spinning',
    preEntreno: 'Plátano o 3 dátiles + agua con pizca de sal',
    desayuno: 'Kéfir + plátano + 2 huevos sancochados',
    mediaManana: 'Cottage + tomate cherry',
    almuerzo: 'Lomo saltado: más carne, papa sancochada/horno, ½ arroz',
    snackTarde: 'Yogur griego + canela',
    cena: 'Ensalada grande + atún/huevo',
    proteinaEstimada: 95,
    proteinaPorComida: { preEntreno: 2, desayuno: 20, mediaManana: 14, almuerzo: 34, snackTarde: 10, cena: 17 },
  },
  {
    dia: 'Viernes',
    tipo: 'Descanso activo',
    preEntreno: '—',
    desayuno: 'Panqueque de avena/plátano + yogur griego + fresas',
    mediaManana: 'Kéfir en ayunas o media mañana',
    almuerzo: 'Cau cau o mondonguito + arroz pequeño + ensalada',
    snackTarde: 'Piña + cottage',
    cena: 'Sopa de lentejas con verduras',
    proteinaEstimada: 90,
    proteinaPorComida: { preEntreno: 0, desayuno: 18, mediaManana: 7, almuerzo: 28, snackTarde: 15, cena: 18 },
  },
  {
    dia: 'Sábado',
    tipo: 'GYM B · Superior + glúteo',
    preEntreno: '½ plátano o tostada integral',
    desayuno: 'Post: yogur griego + fruta + 2 huevos / o pollo + camote',
    mediaManana: 'Fresas + nueces',
    almuerzo: 'Tallarines rojos: mitad pasta + doble proteína + espinaca',
    snackTarde: 'Kéfir + chía',
    cena: 'Pollo/pavo en tortilla integral con lechuga y pimiento',
    proteinaEstimada: 96,
    proteinaPorComida: { preEntreno: 3, desayuno: 30, mediaManana: 4, almuerzo: 30, snackTarde: 7, cena: 24 },
  },
];

export function getMenuHoy(): DiaMenu {
  return MENU_SEMANAL[new Date().getDay()];
}

export const RECETAS_RAPIDAS = [
  {
    id: 'rr-1',
    nombre: 'Batido kéfir post-spinning',
    tiempo: '3 min',
    idealPara: 'Post entreno',
    ingredientes: ['Kéfir', 'plátano', 'fresas', 'linaza', 'canela'],
    preparacion: 'Licuar todo. Tomar al terminar.',
    proteina: '18 g',
    nota: 'Añadir 1 scoop proteína solo si nutricionista lo aprueba.',
    icon: '🥤',
  },
  {
    id: 'rr-2',
    nombre: 'Omelette cottage',
    tiempo: '5 min',
    idealPara: 'Desayuno',
    ingredientes: ['2 huevos', 'espinaca', 'tomate cherry', 'cottage'],
    preparacion: 'Sartén antiadherente, doblar y servir.',
    proteina: '28 g',
    nota: 'Excelente post-gym.',
    icon: '🍳',
  },
  {
    id: 'rr-3',
    nombre: 'Wrap integral express',
    tiempo: '7 min',
    idealPara: 'Cena/snack',
    ingredientes: ['Tortilla integral', 'pollo o atún', 'lechuga', 'pimiento', 'cottage'],
    preparacion: 'Rellenar, enrollar y dorar 1 min.',
    proteina: '30 g',
    nota: 'Muy práctico para oficina.',
    icon: '🌯',
  },
  {
    id: 'rr-4',
    nombre: 'Bowl quinua y pollo',
    tiempo: '15 min',
    idealPara: 'Almuerzo',
    ingredientes: ['Quinua cocida', 'pollo', 'espinaca', 'tomate', 'zanahoria'],
    preparacion: 'Armar bowl con aderezo de limón y oliva.',
    proteina: '35 g',
    nota: 'Usa sobras del almuerzo anterior.',
    icon: '🥗',
  },
  {
    id: 'rr-5',
    nombre: 'Panqueques de avena',
    tiempo: '10 min',
    idealPara: 'Desayuno libre',
    ingredientes: ['Avena', 'plátano', '2 huevos', 'canela'],
    preparacion: 'Mezclar y cocinar a fuego medio.',
    proteina: '18 g',
    nota: 'Completar con yogur griego.',
    icon: '🥞',
  },
  {
    id: 'rr-6',
    nombre: 'Sopa lentejas power',
    tiempo: '20 min',
    idealPara: 'Cena',
    ingredientes: ['Lentejas', 'pollo', 'cebolla', 'zanahoria', 'espinaca'],
    preparacion: 'Cocinar y agregar pollo desmenuzado.',
    proteina: '30 g',
    nota: 'Fibra + proteína. Ideal para Viernes.',
    icon: '🍲',
  },
  {
    id: 'rr-7',
    nombre: 'Cottage snack box',
    tiempo: '3 min',
    idealPara: 'Media mañana',
    ingredientes: ['Cottage', 'tomate cherry', 'zanahoria baby', 'pimiento'],
    preparacion: 'Poner todo en táper.',
    proteina: '18 g',
    nota: 'Snack anti-ansiedad, crujiente y proteico.',
    icon: '📦',
  },
];

export const LISTA_COMPRAS = [
  { categoria: 'Proteína',     producto: 'Huevos',                    cantidad: '18 unidades',     uso: 'Desayuno/cena',         prioridad: 'Alta' },
  { categoria: 'Proteína',     producto: 'Pollo/pavo',                cantidad: '1.2 – 1.5 kg',    uso: 'Almuerzos/cenas',       prioridad: 'Alta' },
  { categoria: 'Proteína',     producto: 'Pescado (bonito/jurel)',     cantidad: '2 – 3 porciones', uso: 'Omega 3',               prioridad: 'Alta' },
  { categoria: 'Lácteos',      producto: 'Kéfir natural',             cantidad: '1.2 – 1.5 L',     uso: '5-7 tomas',            prioridad: 'Alta' },
  { categoria: 'Lácteos',      producto: 'Yogur griego natural',      cantidad: '1 kg',            uso: 'Desayunos/snacks',      prioridad: 'Alta' },
  { categoria: 'Lácteos',      producto: 'Queso cottage',             cantidad: '500 – 700 g',     uso: 'Snacks/wraps',         prioridad: 'Media' },
  { categoria: 'Verduras',     producto: 'Tomate cherry',             cantidad: '2 bandejas',      uso: 'Snacks/ensaladas',     prioridad: 'Alta' },
  { categoria: 'Verduras',     producto: 'Espinaca',                  cantidad: '2 bolsas',        uso: 'Omelettes/ensaladas',  prioridad: 'Alta' },
  { categoria: 'Verduras',     producto: 'Zanahorias baby',           cantidad: '1 bolsa',         uso: 'Snack',                prioridad: 'Media' },
  { categoria: 'Verduras',     producto: 'Cebolla + pimiento + lechuga', cantidad: '1-2 kg mixto', uso: 'Guisos/ensaladas',    prioridad: 'Alta' },
  { categoria: 'Frutas',       producto: 'Fresas',                    cantidad: '500 g',           uso: 'Antioxidantes',        prioridad: 'Alta' },
  { categoria: 'Frutas',       producto: 'Piña',                      cantidad: '1 unidad',        uso: 'Bromelina/digestión',  prioridad: 'Media' },
  { categoria: 'Frutas',       producto: 'Plátanos',                  cantidad: '7 unidades',      uso: 'Pre-entreno',          prioridad: 'Alta' },
  { categoria: 'Carbos',       producto: 'Avena, quinua, arroz integral, camote', cantidad: '1 paquete/cada uno', uso: 'Energía y fibra', prioridad: 'Alta' },
  { categoria: 'Grasas/fibra', producto: 'Chía, linaza, nueces',      cantidad: '1 bolsa/cada uno', uso: 'Microbiota/omega 3', prioridad: 'Media' },
  { categoria: 'Otros',        producto: 'Tortillas integrales',      cantidad: '1 paquete',       uso: 'Wraps rápidos',        prioridad: 'Media' },
];

export const CAT_ICONS_COMPRAS: Record<string, string> = {
  'Proteína': '🥩',
  'Lácteos': '🥛',
  'Verduras': '🥦',
  'Frutas': '🍓',
  'Carbos': '🌾',
  'Grasas/fibra': '🥜',
  'Otros': '📦',
};
