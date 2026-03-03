import { h } from 'preact';
import type { WizardState, Recommendation } from '../types';
import {
  PROGRAM_LABELS,
  PROGRAM_DESCRIPTIONS,
  PROGRAM_ICONS,
  SERUM_LABELS,
  SERUM_DESCRIPTIONS,
  SERUM_ICONS,
  GOAL_LABELS,
} from '../types';
import { buildWhatsAppMessage } from '../engine';

const WHATSAPP_NUMBER = '5492615459494';
const CALENDLY_URL = 'https://calendly.com/aledovidioatan-oywu/30min';
const VIRTUAL_MEETING_URL = 'https://calendly.com/aledovidioatan-oywu/30min';

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  recommendation: Recommendation | null;
  hasSafetyFlags: boolean;
  onShowResults: () => void;
}

export function StepSafety({ state, onChange, recommendation, hasSafetyFlags, onShowResults }: Props) {
  const {
    safety_accept_1,
    safety_accept_2,
    safety_flag_pregnant,
    safety_flag_complex,
    safety_flag_reaction,
    showResults,
  } = state;

  const allAccepted = safety_accept_1 && safety_accept_2;
  const allAnswered =
    safety_flag_pregnant !== null &&
    safety_flag_complex !== null &&
    safety_flag_reaction !== null;
  const canSubmit = allAccepted && allAnswered;

  if (showResults && recommendation) {
    if (hasSafetyFlags) {
      return <SafetyExitScreen state={state} />;
    }
    return <ResultsScreen state={state} recommendation={recommendation} />;
  }

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Antes de sugerirte una opción, confirmemos esto
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          Evaluación médica preventiva.
        </p>
      </div>

      {/* Checkboxes obligatorios */}
      <div class="space-y-3">
        <CheckboxItem
          checked={safety_accept_1}
          onChange={(v) => onChange({ safety_accept_1: v })}
          label="Confirmo que la información proporcionada es verídica y exacta para mi historial clínico."
        />
        <CheckboxItem
          checked={safety_accept_2}
          onChange={(v) => onChange({ safety_accept_2: v })}
          label="Acepto que esto es una recomendación orientativa y requiere evaluación profesional antes de iniciar."
        />
      </div>

      {/* Preguntas de exclusión */}
      <div class="space-y-3">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">
          Preguntas de exclusión
        </h3>
        <SafetyQuestion
          question="¿Estás embarazada o en período de lactancia?"
          sub="Información crucial para la dosificación."
          name="pregnant"
          value={safety_flag_pregnant}
          onChange={(v) => onChange({ safety_flag_pregnant: v })}
        />
        <SafetyQuestion
          question="¿Tenés una condición médica compleja en tratamiento activo?"
          sub="Incluye diagnósticos crónicos actuales."
          name="complex"
          value={safety_flag_complex}
          onChange={(v) => onChange({ safety_flag_complex: v })}
        />
        <SafetyQuestion
          question="¿Tuviste alguna reacción previa a sueros o infusiones?"
          name="reaction"
          value={safety_flag_reaction}
          onChange={(v) => onChange({ safety_flag_reaction: v })}
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onShowResults}
        class={[
          'w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2',
          canSubmit
            ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
        ].join(' ')}
      >
        Ver sugerencia personalizada
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>

      <p class="text-center text-xs text-slate-400 dark:text-slate-500 italic">
        Esto no reemplaza la evaluación previa con un profesional.
      </p>
    </div>
  );
}

// ── Safety exit screen ───────────────────────────────────────────────────────

function SafetyExitScreen({ state }: { state: WizardState }) {
  const waMsg = encodeURIComponent(
    'Hola Liva, completé el wizard pero respondí "Sí" en preguntas de seguridad. Me gustaría tener una evaluación previa.'
  );

  return (
    <div class="text-center space-y-6 py-4">
      <div class="mx-auto w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-3xl text-amber-500">health_and_safety</span>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          Vamos a cuidarte mejor
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Por seguridad, te recomendamos una reunión virtual breve con nuestro equipo antes de sugerir un plan personalizado.
        </p>
      </div>
      <div class="space-y-3 max-w-sm mx-auto">
        <a
          href={VIRTUAL_MEETING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => window.dispatchEvent(new CustomEvent('calendly:open'))}
          class="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">video_call</span>
          Agendar reunión virtual
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          class="w-full py-3 border-2 border-primary/20 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[#25D366]">forum</span>
          Hablar por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  state,
  recommendation,
}: {
  state: WizardState;
  recommendation: Recommendation;
}) {
  const { program, serum, serumIsUpgrade, reasons, modalidad } = recommendation;
  const waMsg = buildWhatsAppMessage(state, recommendation);

  const openCalendly = () => {
    window.dispatchEvent(new CustomEvent('wizard_result_cta', { detail: { cta: 'calendly' } }));
    window.dispatchEvent(new CustomEvent('calendly:open'));
    if (typeof (window as any).Calendly !== 'undefined') {
      (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank');
    }
  };

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="text-center">
        <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
          Análisis completado
        </span>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Tu recomendación LIVA
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          Basada en tus respuestas. La validación final es en evaluación profesional.
        </p>
      </div>

      {/* Programa */}
      <div class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
        <div class="h-32 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center gap-3">
          <span class="material-symbols-outlined text-4xl text-primary" style="font-variation-settings: 'FILL' 1, 'wght' 400;">{PROGRAM_ICONS[program]}</span>
          <h3 class="text-xl font-bold text-slate-800">{PROGRAM_LABELS[program]}</h3>
        </div>
        <div class="p-5">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">
            Programa recomendado
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">
            {PROGRAM_DESCRIPTIONS[program]}
          </p>
          {state.preference === 'program' && (
            <div class="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base" style="font-variation-settings: 'FILL' 1, 'wght' 400;">check_circle</span>
                4–8 sesiones mensuales
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base" style="font-variation-settings: 'FILL' 1, 'wght' 400;">check_circle</span>
                Seguimiento biométrico
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base" style="font-variation-settings: 'FILL' 1, 'wght' 400;">check_circle</span>
                Soporte nutricional incluido
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suero */}
      <div class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
        <div class="h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center gap-3">
          <span class="material-symbols-outlined text-3xl text-primary">{SERUM_ICONS[serum]}</span>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{SERUM_LABELS[serum]}</h3>
        </div>
        <div class="p-5">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">
            {serumIsUpgrade ? 'Suero sugerido (upgrade premium)' : 'Suero sugerido'}
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            {SERUM_DESCRIPTIONS[serum]}
          </p>
          {serumIsUpgrade && (
            <div class="mt-2 inline-flex items-center px-2 py-1 rounded bg-primary/5 text-primary text-xs font-bold gap-1">
              <span class="material-symbols-outlined text-sm">auto_awesome</span>
              Upgrade opcional
            </div>
          )}
        </div>
      </div>

      {/* Por qué */}
      <div class="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
        <p class="text-xs text-primary font-bold uppercase tracking-widest mb-3">
          Por qué te lo sugerimos
        </p>
        <ul class="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1, 'wght' 400;">check_circle</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Modalidad */}
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1, 'wght' 400;">location_on</span>
        <span><strong>Modalidad:</strong> {modalidad}</span>
      </div>

      {/* CTAs */}
      <div class="space-y-3">
        <button
          type="button"
          onClick={openCalendly}
          class="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">calendar_today</span>
          Agendar turno online
        </button>
        <div class="grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            class="py-3 bg-white dark:bg-slate-800 border-2 border-primary/20 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span class="material-symbols-outlined text-[#25D366]">forum</span>
            WhatsApp
          </a>
          <a
            href={VIRTUAL_MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="py-3 bg-white dark:bg-slate-800 border-2 border-primary/20 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span class="material-symbols-outlined text-blue-500">video_call</span>
            Virtual
          </a>
        </div>
        <p class="text-center text-xs text-slate-400 mt-2 px-4">
          Al agendar, confirmás que has leído nuestras políticas de privacidad y términos de servicio.
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface CheckboxItemProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function CheckboxItem({ checked, onChange, label }: CheckboxItemProps) {
  return (
    <label class="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 cursor-pointer border border-transparent hover:border-primary/20 transition-all">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
        class="mt-1 h-5 w-5 rounded accent-primary shrink-0"
      />
      <span class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{label}</span>
    </label>
  );
}

interface SafetyQuestionProps {
  question: string;
  sub?: string;
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}

function SafetyQuestion({ question, sub, name, value, onChange }: SafetyQuestionProps) {
  return (
    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 gap-3">
      <div>
        <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{question}</p>
        {sub && <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div class="flex gap-4 shrink-0">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === true}
            onChange={() => onChange(true)}
            class="h-4 w-4 accent-primary"
          />
          <span class="text-sm text-slate-700 dark:text-slate-300">Sí</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === false}
            onChange={() => onChange(false)}
            class="h-4 w-4 accent-primary"
          />
          <span class="text-sm text-slate-700 dark:text-slate-300">No</span>
        </label>
      </div>
    </div>
  );
}
