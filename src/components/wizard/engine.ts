import type {
  WizardState,
  Program,
  Serum,
  Recommendation,
} from './types';
import {
  PROGRAM_LABELS,
  SERUM_LABELS,
  GOAL_LABELS,
  PROGRAM_DESCRIPTIONS,
  SERUM_DESCRIPTIONS,
} from './types';

export function computeRecommendation(state: WizardState): Recommendation {
  const program = resolveProgram(state);
  const { serum, serumIsUpgrade } = resolveSerum(state, program);
  const reasons = buildReasons(state, program, serum);
  const modalidad = buildModalidad(state);

  return { program, serum, serumIsUpgrade, reasons, modalidad };
}

function resolveProgram(state: WizardState): Program {
  const { goal_primary, goal_secondary, recovery_context, train_3plus } = state;

  if (recovery_context || goal_primary === 'inmunidad') return 'RECOVERY';
  if (goal_primary === 'rendimiento') return 'DYNAMO';

  // Exception: energía + entrena 3+ + rendimiento como secundario → DYNAMO
  if (
    goal_primary === 'energia' &&
    train_3plus &&
    goal_secondary.includes('rendimiento')
  ) {
    return 'DYNAMO';
  }

  return 'LONGEVITY';
}

function resolveSerum(
  state: WizardState,
  program: Program
): { serum: Serum; serumIsUpgrade: boolean } {
  const { goal_primary, intensity } = state;

  switch (goal_primary) {
    case 'estres':
      return { serum: 'CALM', serumIsUpgrade: false };
    case 'rendimiento':
      return { serum: 'SPORT', serumIsUpgrade: false };
    case 'piel':
      return { serum: 'GLOW', serumIsUpgrade: false };
    case 'metabolismo':
      return { serum: 'FIT', serumIsUpgrade: false };
    case 'inmunidad':
      return { serum: 'INMUNITY', serumIsUpgrade: false };
    case 'energia':
      if (intensity === 'intensive') {
        return { serum: 'NAD+', serumIsUpgrade: false };
      }
      // Soft: base del programa, NAD+ como upgrade
      return { serum: 'NAD+', serumIsUpgrade: true };
    default:
      // Fallback por programa
      if (program === 'RECOVERY') return { serum: 'INMUNITY', serumIsUpgrade: false };
      if (program === 'DYNAMO') return { serum: 'SPORT', serumIsUpgrade: false };
      return { serum: 'NAD+', serumIsUpgrade: false };
  }
}

function buildReasons(
  state: WizardState,
  program: Program,
  serum: Serum
): string[] {
  const reasons: string[] = [];

  if (state.goal_primary) {
    reasons.push(
      `Tu objetivo principal es ${GOAL_LABELS[state.goal_primary].toLowerCase()}, por eso elegimos el ${PROGRAM_LABELS[program]}.`
    );
  }

  reasons.push(PROGRAM_DESCRIPTIONS[program]);
  reasons.push(
    `El suero ${SERUM_LABELS[serum]} es ideal: ${SERUM_DESCRIPTIONS[serum]}`
  );

  return reasons;
}

function buildModalidad(state: WizardState): string {
  const { city, mode, zone } = state;
  if (!city || !mode) return 'A definir en consulta';

  if (mode === 'clinic') {
    if (city === 'sanjuan') return 'Consultorio · San Juan';
    return 'Consultorio · Mendoza';
  }

  if (zone === 'dalvian') return 'Domicilio · Barrio Dalvian (prioridad alta)';
  if (zone === 'mendoza_otro') return 'Domicilio · Gran Mendoza';
  if (city === 'sanjuan') return 'Domicilio · San Juan';
  return 'Domicilio · Mendoza';
}

export function buildWhatsAppMessage(
  state: WizardState,
  rec: Recommendation
): string {
  const zona = buildModalidad(state);
  const goal = state.goal_primary ? GOAL_LABELS[state.goal_primary] : 'no especificado';
  const msg = [
    `Hola Liva, hice el wizard.`,
    `Estoy en: ${zona}.`,
    `Mi objetivo principal: ${goal}.`,
    `Recomendación: ${PROGRAM_LABELS[rec.program]} + ${SERUM_LABELS[rec.serum]}.`,
    `Quiero agendar.`,
  ].join(' ');
  return encodeURIComponent(msg);
}

export function hasSafetyFlags(state: WizardState): boolean {
  return (
    state.safety_flag_pregnant === true ||
    state.safety_flag_complex === true ||
    state.safety_flag_reaction === true
  );
}
