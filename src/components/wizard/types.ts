export type City = 'mendoza' | 'sanjuan';
export type Mode = 'home' | 'clinic';
export type Zone = 'dalvian' | 'mendoza_otro' | 'sanjuan';

export type Goal =
  | 'energia'
  | 'estres'
  | 'rendimiento'
  | 'piel'
  | 'metabolismo'
  | 'inmunidad';

export type Preference = 'single' | 'program';
export type Intensity = 'soft' | 'intensive';

export type Program = 'RECOVERY' | 'LONGEVITY' | 'DYNAMO';
export type Serum = 'GLOW' | 'SPORT' | 'CALM' | 'FIT' | 'INMUNITY' | 'NAD+';

export interface WizardState {
  step: number;
  city: City | null;
  mode: Mode | null;
  zone: Zone | null;
  goal_primary: Goal | null;
  goal_secondary: Goal[];
  train_3plus: boolean;
  sleep_issue: boolean;
  stress_high: boolean;
  recovery_context: boolean;
  preference: Preference | null;
  intensity: Intensity | null;
  safety_accept_1: boolean;
  safety_accept_2: boolean;
  safety_flag_pregnant: boolean | null;
  safety_flag_complex: boolean | null;
  safety_flag_reaction: boolean | null;
  showResults: boolean;
}

export interface Recommendation {
  program: Program;
  serum: Serum;
  serumIsUpgrade: boolean;
  reasons: string[];
  modalidad: string;
}

export const INITIAL_STATE: WizardState = {
  step: 1,
  city: null,
  mode: null,
  zone: null,
  goal_primary: null,
  goal_secondary: [],
  train_3plus: false,
  sleep_issue: false,
  stress_high: false,
  recovery_context: false,
  preference: null,
  intensity: null,
  safety_accept_1: false,
  safety_accept_2: false,
  safety_flag_pregnant: null,
  safety_flag_complex: null,
  safety_flag_reaction: null,
  showResults: false,
};

export const TOTAL_STEPS = 4;

export const GOAL_LABELS: Record<Goal, string> = {
  energia: 'Energía / claridad mental',
  estres: 'Estrés / descanso',
  rendimiento: 'Rendimiento deportivo',
  piel: 'Piel / glow / antiage',
  metabolismo: 'Metabolismo / composición',
  inmunidad: 'Inmunidad / recuperación',
};

export const GOAL_ICONS: Record<Goal, string> = {
  energia: 'bolt',
  estres: 'self_improvement',
  rendimiento: 'fitness_center',
  piel: 'face_5',
  metabolismo: 'nutrition',
  inmunidad: 'shield',
};

export const PROGRAM_LABELS: Record<Program, string> = {
  RECOVERY: 'Recovery Protocol',
  LONGEVITY: 'Longevity Program',
  DYNAMO: 'Dynamo Performance',
};

export const PROGRAM_DESCRIPTIONS: Record<Program, string> = {
  RECOVERY: 'Regeneración, inmunidad y cicatrización acelerada.',
  LONGEVITY: 'Energía celular, claridad mental y antioxidantes.',
  DYNAMO: 'Performance, prevención de lesiones y recuperación muscular.',
};

export const PROGRAM_ICONS: Record<Program, string> = {
  RECOVERY: 'healing',
  LONGEVITY: 'elderly',
  DYNAMO: 'electric_bolt',
};

export const SERUM_LABELS: Record<Serum, string> = {
  GLOW: 'GLOW',
  SPORT: 'SPORT',
  CALM: 'CALM',
  FIT: 'FIT',
  INMUNITY: 'INMUNITY',
  'NAD+': 'NAD+ Boost',
};

export const SERUM_DESCRIPTIONS: Record<Serum, string> = {
  GLOW: 'Antioxidantes, colágeno y vitaminas para piel radiante y antiage.',
  SPORT: 'Aminoácidos y electrolitos para recuperación muscular acelerada.',
  CALM: 'Magnesio, vitamina B y adaptógenos para reducir el cortisol.',
  FIT: 'Metabolismo activo, quema grasa y composición corporal mejorada.',
  INMUNITY: 'Vitamina C mega-dosis, zinc y glutatión para fortalecer defensas.',
  'NAD+': 'Regenerador celular que potencia energía mitocondrial y claridad mental.',
};

export const SERUM_ICONS: Record<Serum, string> = {
  GLOW: 'face_5',
  SPORT: 'sports_score',
  CALM: 'spa',
  FIT: 'monitor_weight',
  INMUNITY: 'vaccines',
  'NAD+': 'electric_bolt',
};
