import { h } from 'preact';
import type { WizardState, City, Mode, Zone } from '../types';

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
}

const MENDOZA_IMG =
  'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600&q=80&fit=crop';
const SANJUAN_IMG =
  'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&q=80&fit=crop';

export function StepLocation({ state, onChange }: Props) {
  const { city, mode, zone } = state;

  const selectCity = (c: City) => {
    const patch: Partial<WizardState> = { city: c };
    if (c === 'sanjuan') patch.zone = 'sanjuan';
    else if (zone === 'sanjuan') patch.zone = null;
    onChange(patch);
  };

  const selectMode = (m: Mode) => {
    const patch: Partial<WizardState> = { mode: m };
    if (m === 'home' && city === 'mendoza') patch.zone = patch.zone ?? null;
    if (m === 'clinic') patch.zone = city === 'sanjuan' ? 'sanjuan' : null;
    onChange(patch);
  };

  return (
    <div class="space-y-10">
      {/* Ubicación */}
      <section>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          ¿Dónde querés atenderte?
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Esto nos ayuda a mostrarte disponibilidad y modalidad.
        </p>
        <div class="grid grid-cols-2 gap-4">
          <CityCard
            label="Mendoza"
            sub="Región Cuyo"
            img={MENDOZA_IMG}
            selected={city === 'mendoza'}
            onClick={() => selectCity('mendoza')}
          />
          <CityCard
            label="San Juan"
            sub="Región Cuyo"
            img={SANJUAN_IMG}
            selected={city === 'sanjuan'}
            onClick={() => selectCity('sanjuan')}
          />
        </div>
      </section>

      {/* Modalidad */}
      {city && (
        <section class="border-t border-primary/10 pt-8">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            ¿Cómo preferís la atención?
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">
            Contamos con servicios presenciales y a domicilio.
          </p>
          <div class="space-y-3">
            <ModeOption
              icon="home_health"
              label="A domicilio"
              sub="Llevamos el cuidado a la puerta de tu casa."
              badge="Recomendado"
              selected={mode === 'home'}
              onClick={() => selectMode('home')}
            />

            {/* Sub-opciones Dalvian solo para Mendoza + domicilio */}
            {mode === 'home' && city === 'mendoza' && (
              <div class="ml-16 space-y-2 animate-slide-down">
                <ZoneRadio
                  label="Estoy en Barrio Dalvian"
                  name="zone"
                  checked={zone === 'dalvian'}
                  onChange={() => onChange({ zone: 'dalvian' })}
                />
                <ZoneRadio
                  label="Estoy en otra zona de Mendoza"
                  name="zone"
                  checked={zone === 'mendoza_otro'}
                  onChange={() => onChange({ zone: 'mendoza_otro' })}
                />
                <div class="flex items-start gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 p-3 border-l-4 border-primary">
                  <span
                    class="material-symbols-outlined text-primary shrink-0"
                    style="font-size: 18px;"
                  >
                    info
                  </span>
                  <p class="text-xs text-primary font-medium leading-relaxed italic">
                    "En Dalvian priorizamos ventanas de atención a domicilio para una
                    experiencia premium y veloz."
                  </p>
                </div>
              </div>
            )}

            <ModeOption
              icon="apartment"
              label="Consultorio"
              sub="Visitá nuestros centros de atención asociados."
              selected={mode === 'clinic'}
              onClick={() => selectMode('clinic')}
            />
          </div>
        </section>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface CityCardProps {
  label: string;
  sub: string;
  img: string;
  selected: boolean;
  onClick: () => void;
}

function CityCard({ label, sub, img, selected, onClick }: CityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={[
        'group relative cursor-pointer rounded-xl border-2 p-3 text-left transition-all hover:shadow-md w-full',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/50',
      ].join(' ')}
    >
      <div class="mb-3 h-28 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
        <img
          src={img}
          alt={`Paisaje de ${label}`}
          class={[
            'h-full w-full object-cover transition-all duration-300 group-hover:scale-105',
            !selected ? 'grayscale group-hover:grayscale-0' : '',
          ].join(' ')}
          loading="lazy"
        />
      </div>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">{label}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
        </div>
        <span
          class={[
            'material-symbols-outlined text-lg',
            selected ? 'text-primary' : 'text-slate-300 dark:text-slate-600',
          ].join(' ')}
          style="font-variation-settings: 'FILL' 1, 'wght' 400;"
        >
          {selected ? 'check_circle' : 'radio_button_unchecked'}
        </span>
      </div>
    </button>
  );
}

interface ModeOptionProps {
  icon: string;
  label: string;
  sub: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
}

function ModeOption({ icon, label, sub, badge, selected, onClick }: ModeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={[
        'relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 w-full text-left transition-all',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50',
      ].join(' ')}
    >
      <div
        class={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
          selected
            ? 'bg-primary text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
        ].join(' ')}
      >
        <span class="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm">{label}</h4>
          {badge && (
            <span class="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-tight">
              {badge}
            </span>
          )}
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
      </div>
      <span
        class={[
          'material-symbols-outlined text-xl shrink-0',
          selected ? 'text-primary' : 'text-slate-300 dark:text-slate-600',
        ].join(' ')}
        style="font-variation-settings: 'FILL' 1, 'wght' 400;"
      >
        {selected ? 'radio_button_checked' : 'radio_button_unchecked'}
      </span>
    </button>
  );
}

interface ZoneRadioProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}

function ZoneRadio({ label, name, checked, onChange }: ZoneRadioProps) {
  return (
    <label class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        class="w-4 h-4 text-primary border-slate-300 focus:ring-primary accent-primary"
      />
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  );
}
