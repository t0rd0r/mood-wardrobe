import type { ClothingItem, MoodFilter } from '../types/clothing'
import { MOODS } from '../data/clothing'

const filterChips: { label: string; value: MoodFilter }[] = [
  { label: 'All', value: 'all' },
  ...MOODS,
]

const moodColor: Record<MoodFilter, string> = {
  all: 'bg-slate-100 text-slate-700',
  chill: 'bg-ocean/15 text-ocean',
  sporty: 'bg-lime/20 text-lime-700',
  bold: 'bg-blush/20 text-rose-600',
  business: 'bg-slate-200 text-slate-800',
}

interface ClothesCatalogProps {
  items: ClothingItem[]
  activeMood: MoodFilter
  selectedId?: string
  onMoodChange: (mood: MoodFilter) => void
  onSelect: (item: ClothingItem) => void
}

export default function ClothesCatalog({
  items,
  activeMood,
  selectedId,
  onMoodChange,
  onSelect,
}: ClothesCatalogProps) {
  return (
    <div className="glass-panel rounded-3xl p-4 shadow-card sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Каталог
          </p>
          <h2 className="text-xl font-semibold">Mood Wardrobe</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => onMoodChange(chip.value)}
              className={`chip ${
                chip.value === activeMood ? 'chip-active' : 'bg-white/70'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => {
          const isActive = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-3 text-left transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg ${
                isActive ? 'ring-2 ring-ink' : ''
              }`}
            >
              <div
                className={`pill ${moodColor[item.mood]} absolute left-3 top-3 bg-white/80`}
              >
                {item.mood}
              </div>
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className={`max-h-32 transition duration-300 ${
                    isActive ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
              <p className="text-xs text-slate-500">Mood: {item.mood}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
