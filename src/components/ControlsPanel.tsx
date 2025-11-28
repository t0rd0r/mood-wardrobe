import type { MoodFilter, TransformState } from '../types/clothing'

interface ControlsPanelProps {
  transform: TransformState
  activeMood: MoodFilter
  onChange: (field: keyof TransformState, value: number) => void
  onReset: () => void
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  field: keyof TransformState
  suffix?: string
}

export default function ControlsPanel({
  transform,
  activeMood,
  onChange,
  onReset,
}: ControlsPanelProps) {
  const sliders: SliderProps[] = [
    {
      label: 'Размер',
      value: transform.scale,
      min: 0.5,
      max: 2,
      step: 0.05,
      field: 'scale',
      suffix: 'x',
    },
    {
      label: 'Поворот',
      value: transform.rotation,
      min: -20,
      max: 20,
      step: 1,
      field: 'rotation',
      suffix: '°',
    },
    {
      label: 'Смещение X',
      value: transform.offsetX,
      min: -120,
      max: 120,
      step: 2,
      field: 'offsetX',
      suffix: 'px',
    },
    {
      label: 'Смещение Y',
      value: transform.offsetY,
      min: -120,
      max: 120,
      step: 2,
      field: 'offsetY',
      suffix: 'px',
    },
    {
      label: 'Прозрачность',
      value: transform.opacity,
      min: 0.3,
      max: 1,
      step: 0.02,
      field: 'opacity',
    },
  ]

  return (
    <div className="glass-panel rounded-3xl p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Настройки
          </p>
          <h3 className="text-xl font-semibold">Коррекция одежды</h3>
        </div>
        <span className="pill bg-ink text-white">
          Mood: <span className="capitalize">{activeMood}</span>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sliders.map((slider) => (
          <div key={slider.field} className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>{slider.label}</span>
              <span className="text-xs text-slate-500">
                {slider.value.toFixed(2)}
                {slider.suffix ?? ''}
              </span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={(event) =>
                onChange(slider.field, Number(event.target.value))
              }
              className="w-full accent-ink"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Все изменения применяются в реальном времени.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-[1px] hover:border-ink hover:bg-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
