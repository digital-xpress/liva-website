import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type { WizardState, Recommendation } from './types';
import { INITIAL_STATE, TOTAL_STEPS } from './types';
import { computeRecommendation, hasSafetyFlags } from './engine';
import { StepLocation } from './steps/StepLocation';
import { StepGoals } from './steps/StepGoals';
import { StepContext } from './steps/StepContext';
import { StepSafety } from './steps/StepSafety';

const STORAGE_KEY = 'liva-wizard-state';

const STEP_TITLES = [
  'Ubicación y modalidad',
  'Tus objetivos',
  'Contexto personal',
  'Confirmación',
];

function loadState(): WizardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WizardState;
      // Reset results view on reload
      return { ...parsed, showResults: false };
    }
  } catch {}
  return INITIAL_STATE;
}

function saveState(state: WizardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function Wizard() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const contentRef = useRef<HTMLDivElement>(null);

  // Load persisted state on mount
  useEffect(() => {
    const persisted = loadState();
    setState(persisted);
  }, []);

  // Listen for open event
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      window.dispatchEvent(new CustomEvent('wizard_start'));
      window.dispatchEvent(new CustomEvent(`wizard_step_view_${state.step}`));
    };
    window.addEventListener('wizard:open', onOpen);
    return () => window.removeEventListener('wizard:open', onOpen);
  }, [state.step]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const patch = useCallback(
    (update: Partial<WizardState>) => {
      setState((prev) => {
        const next = { ...prev, ...update };
        saveState(next);
        return next;
      });
    },
    []
  );

  const canAdvance = (): boolean => {
    const s = state;
    switch (s.step) {
      case 1:
        if (!s.city || !s.mode) return false;
        if (s.mode === 'home' && s.city === 'mendoza' && !s.zone) return false;
        return true;
      case 2:
        return !!s.goal_primary;
      case 3:
        return !!s.preference && !!s.intensity;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const scrollToTop = () => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    contentRef.current?.scrollTo({ top: 0, behavior });
  };

  const goNext = () => {
    if (!canAdvance()) return;
    if (state.step >= TOTAL_STEPS) return;
    window.dispatchEvent(new CustomEvent(`wizard_step_complete_${state.step}`));
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => {
      patch({ step: state.step + 1 });
      setAnimating(false);
      scrollToTop();
      window.dispatchEvent(new CustomEvent(`wizard_step_view_${state.step + 1}`));
    }, 180);
  };

  const goBack = () => {
    if (state.showResults) {
      patch({ showResults: false });
      scrollToTop();
      return;
    }
    if (state.step <= 1) {
      close();
      return;
    }
    setDirection('back');
    setAnimating(true);
    setTimeout(() => {
      patch({ step: state.step - 1 });
      setAnimating(false);
      scrollToTop();
    }, 180);
  };

  const close = () => {
    window.dispatchEvent(new CustomEvent(`wizard_dropoff_${state.step}`));
    setOpen(false);
  };

  const handleShowResults = () => {
    const flags = hasSafetyFlags(state);
    window.dispatchEvent(
      new CustomEvent('wizard_result_program_' + (flags ? 'safety_exit' : computeRecommendation(state).program))
    );
    patch({ showResults: true });
  };

  const recommendation: Recommendation | null = state.goal_primary
    ? computeRecommendation(state)
    : null;

  const flags = hasSafetyFlags(state);
  const progress = state.showResults ? 100 : Math.round((state.step / TOTAL_STEPS) * 100);

  if (!open) return null;

  const animClass = animating
    ? direction === 'forward'
      ? 'opacity-0 translate-x-4'
      : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0';

  return (
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Wizard de recomendación LIVA"
    >
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div class="relative w-full h-full md:h-auto md:max-h-[92vh] md:max-w-[640px] md:mx-4 bg-white dark:bg-slate-900 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <header class="flex items-center justify-between border-b border-primary/10 px-5 py-4 shrink-0">
          <div class="flex items-center gap-2">
            <span
              class="material-symbols-outlined text-primary text-2xl"
              style="font-variation-settings: 'FILL' 0, 'wght' 300;"
            >
              fluid_med
            </span>
            <span class="text-base font-bold tracking-tight text-primary">LIVA</span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar wizard"
            class="flex items-center justify-center rounded-full p-2 hover:bg-primary/10 transition-colors text-slate-500 hover:text-primary"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Progress bar */}
        <div class="px-5 pt-5 pb-2 shrink-0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-primary uppercase tracking-wider">
              {state.showResults ? 'Tu recomendación' : `Paso ${state.step} de ${TOTAL_STEPS}`}
            </span>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              {progress}% completado
            </span>
          </div>
          <div class="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              style={`width: ${progress}%;`}
            />
          </div>
          {!state.showResults && (
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              {STEP_TITLES[state.step - 1]}
            </p>
          )}
        </div>

        {/* Step content */}
        <div
          ref={contentRef}
          class={[
            'flex-1 overflow-y-auto px-5 py-6 transition-all duration-200',
            animClass,
          ].join(' ')}
        >
          {state.step === 1 && <StepLocation state={state} onChange={patch} />}
          {state.step === 2 && <StepGoals state={state} onChange={patch} />}
          {state.step === 3 && <StepContext state={state} onChange={patch} />}
          {state.step === 4 && (
            <StepSafety
              state={state}
              onChange={patch}
              recommendation={recommendation}
              hasSafetyFlags={flags}
              onShowResults={handleShowResults}
            />
          )}
        </div>

        {/* Footer navigation (hidden on step 4 results or safety exit) */}
        {!(state.step === 4) && (
          <footer class="border-t border-primary/10 p-5 bg-slate-50 dark:bg-slate-800/50 shrink-0 flex flex-col gap-2">
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={goNext}
              class={[
                'w-full py-4 rounded-xl font-bold text-base transition-all',
                canAdvance()
                  ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
              ].join(' ')}
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={goBack}
              class="w-full py-2.5 text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-primary transition-colors"
            >
              {state.step === 1 ? 'Cancelar' : 'Volver atrás'}
            </button>
          </footer>
        )}

        {/* Footer back button only on step 4 if not showing results */}
        {state.step === 4 && !state.showResults && (
          <footer class="border-t border-primary/10 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 shrink-0">
            <button
              type="button"
              onClick={goBack}
              class="w-full py-2.5 text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-primary transition-colors"
            >
              Volver atrás
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
