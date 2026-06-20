export type Intensidad = 'Baja' | 'Media' | 'Media-Alta' | 'Alta';
export type TipoSesion = 'gym' | 'cardio' | 'descanso' | 'opcional';

export type DiaEntrenamiento = {
  dia: string;
  sesion: string;
  duracion: string;
  objetivo: string;
  detalle: string;
  ejercicios: string[];
  intensidad: Intensidad;
  notasNutricion: string;
  tipo: TipoSesion;
  icon: string;
};

// Índice 0 = Domingo, 1 = Lunes, ..., 6 = Sábado (igual que Date.getDay())
export const PLAN_SEMANAL: DiaEntrenamiento[] = [
  {
    dia: 'Domingo',
    sesion: 'Descanso total',
    duracion: '—',
    objetivo: 'Recuperación',
    detalle: 'Sueño, caminata opcional, preparación de snacks para la semana.',
    ejercicios: ['Caminata suave (opcional)', 'Prep meal-prep de snacks'],
    intensidad: 'Baja',
    notasNutricion: 'Kéfir + comida familiar consciente. Cena ligera.',
    tipo: 'descanso',
    icon: '😴',
  },
  {
    dia: 'Lunes',
    sesion: 'Descanso activo / caminata',
    duracion: '20–40 min',
    objetivo: 'Recuperación',
    detalle: 'Caminata suave, movilidad o respiración 10 min. Bajar estrés.',
    ejercicios: ['Caminata 20-40 min', 'Movilidad 10 min', 'Respiración'],
    intensidad: 'Baja',
    notasNutricion: 'Proteína normal + kéfir. Sin necesidad de pre-entreno.',
    tipo: 'descanso',
    icon: '🚶',
  },
  {
    dia: 'Martes',
    sesion: 'GYM A: Pierna + glúteo',
    duracion: '55–65 min',
    objetivo: 'Músculo',
    detalle: 'Día de fuerza de pierna. Prioritario para recomposición.',
    ejercicios: [
      'Hip thrust 4×8-10',
      'Sentadilla / Prensa 3×8-10',
      'Peso muerto rumano 3×8-10',
      'Abductores 3×12-15',
      'Core 8 min',
    ],
    intensidad: 'Media-Alta',
    notasNutricion: 'Pre: ½ plátano + agua. Post: 25-30 g proteína + carbo.',
    tipo: 'gym',
    icon: '🏋️',
  },
  {
    dia: 'Miércoles',
    sesion: 'Barre / Pilates (opcional)',
    duracion: '45–55 min',
    objetivo: 'Core + movilidad',
    detalle: 'Solo si tienes energía. No reemplaza el gym. Foco en control y postura.',
    ejercicios: ['Barre 45-55 min', 'O Pilates mat', 'Stretching final 10 min'],
    intensidad: 'Media',
    notasNutricion: 'Comida normal, alta fibra. No requiere pre-entreno especial.',
    tipo: 'opcional',
    icon: '🧘',
  },
  {
    dia: 'Jueves',
    sesion: 'Spinning',
    duracion: '45–50 min',
    objetivo: 'Cardio intenso',
    detalle: 'Mantener 1 sesión fuerte de cardio. Evitar sumar otro HIIT si estás agotada.',
    ejercicios: ['Spinning 45-50 min', 'Stretching 5 min'],
    intensidad: 'Alta',
    notasNutricion: 'Pre: plátano o 3 dátiles + agua con pizca de sal. Post: electrolitos + proteína.',
    tipo: 'cardio',
    icon: '🚴',
  },
  {
    dia: 'Viernes',
    sesion: 'Descanso activo',
    duracion: '20–30 min',
    objetivo: 'Bajar cortisol',
    detalle: 'Caminata, stretching, respiración o descanso real. No forzar intensidad.',
    ejercicios: ['Caminata suave 20-30 min', 'Stretching 15 min', 'Respiración / meditación'],
    intensidad: 'Baja',
    notasNutricion: 'Cena ligera + buena hidratación. Omega 3 o menestras.',
    tipo: 'descanso',
    icon: '🌿',
  },
  {
    dia: 'Sábado',
    sesion: 'GYM B: Superior + glúteo',
    duracion: '55–65 min',
    objetivo: 'Tono + postura',
    detalle: 'Fuerza de tren superior. Hip thrust ligero para complementar glúteo.',
    ejercicios: [
      'Jalón al pecho 3×10',
      'Remo con mancuerna 3×10',
      'Press de hombro 3×10',
      'Press de pecho 3×10',
      'Hip thrust ligero 3×12',
      'Core 8 min',
    ],
    intensidad: 'Media-Alta',
    notasNutricion: 'Pre: ½ plátano o tostada integral. Post: proteína + carbo moderado.',
    tipo: 'gym',
    icon: '💪',
  },
];

export function getEntrenamientoHoy(): DiaEntrenamiento {
  return PLAN_SEMANAL[new Date().getDay()];
}

export function getEntrenamientoDelDia(dia: number): DiaEntrenamiento {
  return PLAN_SEMANAL[dia];
}

export const FASES = [
  { fase: 'Fase 1', semanas: '1–4', meta: 'Crear base', descripcion: '2 gym + 1 spinning. Barre/Pilates solo opcional.' },
  { fase: 'Fase 2', semanas: '5–8', meta: 'Progresar cargas', descripcion: 'Subir peso o repeticiones cada 1-2 semanas. Mantener proteína.' },
  { fase: 'Fase 3', semanas: '9–12', meta: 'Definir sin agotarte', descripcion: 'Agregar 4to día suave si el sueño y energía están bien.' },
];

export const PERFIL_CLAUDIA = {
  edad: 30,
  talla: 1.55,
  peso: 48,
  horarioEntreno: '6 – 9 am',
  objetivo: 'Recomposición corporal',
  horizonte: 'Diciembre 2026',
  proteinaObjetivo: { min: 90, max: 100 },
  kefirSemana: 5,
  suenoObjetivo: 7.5,
  aguaObjetivo: 2.5,
  pasosObjetivo: 8000,
};
