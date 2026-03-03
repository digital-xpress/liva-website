import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import type { WizardState, Goal } from '../types';
import { GOAL_LABELS, GOAL_ICONS } from '../types';

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
}

const ALL_GOALS: Goal[] = [
  'energia',
  'estres',
  'rendimiento',
  'piel',
  'metabolismo',
  'inmunidad',
];

function smoothBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export function StepGoals({ state, onChange }: Props) {
  const { goal_primary, goal_secondary } = state;

  const secondaryRef = useRef<HTMLElement>(null);
  const prevGoal = useRef<Goal | null>(goal_primary);

  // Scroll to secondary section when primary goal is first selected
  useEffect(() => {
    const goalJustSelected = goal_primary && !prevGoal.current;
    if (goalJustSelected && secondaryRef.current) {
      const t = setTimeout(
        () => secondaryRef.current?.scrollIntoView({ behavior: smoothBehavior(), block: 'start' }),
        200
      );
      return () => clearTimeout(t);
    }
    prevGoal.current = goal_primary;
  }, [goal_primary]);

  const selectPrimary = (g: Goal) => {
    onChange({
      goal_primary: g,
      goal_secondary: goal_secondary.filter((s) => s !== g),
    });
  };

  const toggleSecondary = (g: Goal) => {
    if (g === goal_primary) return;
    if (g === 'none' as unknown as Goal) {
      onChange({ goal_secondary: [] });
      return;
    }
    const already = goal_secondary.includes(g);
    onChange({
      goal_secondary: already
        ? goal_secondary.filter((s) => s !== g)
        : [...goal_secondary, g],
    });
  };

  const secondaryOptions = ALL_GOALS.filter((g) => g !== goal_primary);

  return (
    <div class="space-y-10">
      {/* Objetivo principal */}
      <section>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          ¿Qué querés mejorar primero?
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Elegí solo 1. Después podés ajustar.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_GOALS.map((g) => (
            <GoalCard
              key={g}
              goal={g}
              selected={goal_primary === g}
              onClick={() => selectPrimary(g)}
            />
          ))}
        </div>
      </section>

      {/* Objetivo secundario */}
      {goal_primary && (
        <section ref={secondaryRef} class="border-t border-primary/10 pt-8">
          <div class="mb-1">
            <span class="text-primary text-xs font-bold uppercase tracking-widest">
              Opcional
            </span>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-5">
            ¿Algo más que te gustaría mejorar?
          </h2>
          <div class="flex flex-wrap gap-2">
            {secondaryOptions.map((g) => (
              <SecondaryPill
                key={g}
                goal={g}
                selected={goal_secondary.includes(g)}
                onClick={() => toggleSecondary(g)}
              />
            ))}
            <button
              type="button"
              onClick={() => onChange({ goal_secondary: [] })}
              class={[
                'px-4 py-2.5 rounded-full border-2 border-dashed text-sm font-medium transition-all',
                goal_secondary.length === 0
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary/50 hover:text-primary',
              ].join(' ')}
            >
              No, solo lo principal
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface GoalCardProps {
  goal: Goal;
  selected: boolean;
  onClick: () => void;
}

function GoalCard({ goal, selected, onClick }: GoalCardProps) {
  const label = GOAL_LABELS[goal];
  const icon = GOAL_ICONS[goal];
  const shortLabel =
    goal === 'energia'
      ? 'Energía'
      : goal === 'estres'
      ? 'Estrés'
      : goal === 'rendimiento'
      ? 'Rendimiento'
      : goal === 'piel'
      ? 'Piel / Glow'
      : goal === 'metabolismo'
      ? 'Metabolismo'
      : 'Inmunidad';

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      class={[
        'flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all',
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-transparent bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:border-primary/30',
      ].join(' ')}
    >
      <span class="material-symbols-outlined text-3xl">{icon}</span>
      <span class="text-xs font-bold text-center leading-tight">{shortLabel}</span>
    </button>
  );
}

interface SecondaryPillProps {
  goal: Goal;
  selected: boolean;
  onClick: () => void;
}

function SecondaryPill({ goal, selected, onClick }: SecondaryPillProps) {
  const label = GOAL_LABELS[goal].split(' / ')[0];
  return (
    <button
      type="button"
      onClick={onClick}
      class={[
        'px-4 py-2.5 rounded-full border text-sm font-medium transition-all',
        selected
          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
          : 'border-primary/20 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary/5',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
