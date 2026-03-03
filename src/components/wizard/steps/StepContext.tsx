import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import type { WizardState, Preference, Intensity } from '../types';

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
}

interface ToggleItem {
  key: keyof Pick<WizardState, 'train_3plus' | 'sleep_issue' | 'stress_high' | 'recovery_context'>;
  icon: string;
  label: string;
}

const TOGGLES: ToggleItem[] = [
  { key: 'train_3plus', icon: 'fitness_center', label: 'Entrenás 3+ veces por semana' },
  { key: 'sleep_issue', icon: 'bedtime', label: 'Dormís mal o te cuesta desconectar' },
  { key: 'stress_high', icon: 'psychology', label: 'Estás en un período de estrés alto' },
  { key: 'recovery_context', icon: 'medical_services', label: 'Estás en recuperación (lesión / post-procedimiento)' },
];

function smoothBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function anyToggleActive(state: WizardState): boolean {
  return state.train_3plus || state.sleep_issue || state.stress_high || state.recovery_context;
}

export function StepContext({ state, onChange }: Props) {
  const { train_3plus, sleep_issue, stress_high, recovery_context, preference, intensity } = state;

  const toggleMap: Record<string, boolean> = {
    train_3plus,
    sleep_issue,
    stress_high,
    recovery_context,
  };

  const togglesActive = anyToggleActive(state);

  const preferenceRef = useRef<HTMLElement>(null);
  const intensityRef = useRef<HTMLElement>(null);
  const prevTogglesActive = useRef(togglesActive);
  const prevPreference = useRef<Preference | null>(preference);

  // Reveal "¿Qué buscás hoy?" when first toggle is activated
  useEffect(() => {
    const justActivated = togglesActive && !prevTogglesActive.current;
    if (justActivated && preferenceRef.current) {
      const t = setTimeout(
        () => preferenceRef.current?.scrollIntoView({ behavior: smoothBehavior(), block: 'start' }),
        200
      );
      return () => clearTimeout(t);
    }
    prevTogglesActive.current = togglesActive;
  }, [togglesActive]);

  // Reveal "¿Qué estilo preferís?" when preference is first selected
  useEffect(() => {
    const prefJustSelected = preference && !prevPreference.current;
    if (prefJustSelected && intensityRef.current) {
      const t = setTimeout(
        () => intensityRef.current?.scrollIntoView({ behavior: smoothBehavior(), block: 'start' }),
        200
      );
      return () => clearTimeout(t);
    }
    prevPreference.current = preference;
  }, [preference]);

  return (
    <div class="space-y-10">
      {/* Contexto rápido */}
      <section>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Contanos un poco para personalizar la sugerencia
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Seleccioná los factores que mejor describan tu estado actual.
        </p>
        <div class="space-y-2">
          {TOGGLES.map(({ key, icon, label }) => (
            <ToggleRow
              key={key}
              icon={icon}
              label={label}
              checked={toggleMap[key]}
              onChange={(v) => onChange({ [key]: v })}
            />
          ))}
        </div>
      </section>

      {/* Tipo de sesión — aparece al activar el primer toggle */}
      {togglesActive && (
        <section ref={preferenceRef} class="border-t border-primary/10 pt-8">
          <p class="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-wider mb-4">
            ¿Qué buscás hoy?
          </p>
          <div class="grid grid-cols-2 gap-4">
            <PreferenceCard
              icon="event_repeat"
              label="Sesión puntual"
              selected={preference === 'single'}
              onClick={() => onChange({ preference: 'single' })}
            />
            <PreferenceCard
              icon="calendar_month"
              label="Programa (4–8 semanas)"
              selected={preference === 'program'}
              onClick={() => onChange({ preference: 'program' })}
            />
          </div>
        </section>
      )}

      {/* Intensidad — aparece al elegir preferencia */}
      {preference && (
        <section ref={intensityRef} class="border-t border-primary/10 pt-8">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-5">
            ¿Qué estilo preferís?
          </h2>
          <div class="space-y-3">
            <IntensityOption
              selected={intensity === 'soft'}
              onClick={() => onChange({ intensity: 'soft' })}
              label="Suave / progresivo"
              sub="Ideal para construir base o mantenimiento."
            />
            <IntensityOption
              selected={intensity === 'intensive'}
              onClick={() => onChange({ intensity: 'intensive' })}
              label="Intensivo / resultados más rápidos"
              sub="Mayor exigencia para objetivos a corto plazo."
            />
          </div>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-3 italic">
            Esto no reemplaza la evaluación previa.
          </p>
        </section>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface ToggleRowProps {
  icon: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ icon, label, checked, onChange }: ToggleRowProps) {
  return (
    <div
      class={[
        'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer',
        checked
          ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
          : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-primary/10',
      ].join(' ')}
      onClick={() => onChange(!checked)}
    >
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm text-primary">
        <span class="material-symbols-outlined">{icon}</span>
      </div>
      <p class="flex-1 text-slate-800 dark:text-slate-200 text-sm font-medium">{label}</p>
      <div class="shrink-0">
        <div
          class={[
            'relative flex h-7 w-12 cursor-pointer items-center rounded-full p-0.5 transition-colors',
            checked ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start',
          ].join(' ')}
        >
          <div class="h-6 w-6 rounded-full bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

interface PreferenceCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function PreferenceCard({ icon, label, selected, onClick }: PreferenceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={[
        'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/30',
      ].join(' ')}
    >
      <span class="material-symbols-outlined text-primary text-2xl mb-2">{icon}</span>
      <span class="text-slate-800 dark:text-slate-200 font-semibold text-sm">{label}</span>
    </button>
  );
}

interface IntensityOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}

function IntensityOption({ selected, onClick, label, sub }: IntensityOptionProps) {
  return (
    <label class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-primary/10 cursor-pointer hover:shadow-md transition-shadow">
      <input
        type="radio"
        name="intensity"
        checked={selected}
        onChange={onClick}
        class="w-5 h-5 accent-primary shrink-0"
      />
      <div>
        <span class="text-slate-900 dark:text-slate-100 font-semibold text-sm block">{label}</span>
        <span class="text-slate-500 dark:text-slate-400 text-xs">{sub}</span>
      </div>
    </label>
  );
}
