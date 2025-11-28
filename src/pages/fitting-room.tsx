import { useEffect, useMemo, useRef, useState } from 'react'
import ClothesCatalog from '../components/ClothesCatalog'
import ControlsPanel from '../components/ControlsPanel'
import FittingCanvas, { BASE_WIDTH_RATIO } from '../components/FittingCanvas'
import { CLOTHING_ITEMS } from '../data/clothing'
import type {
  ClothingItem,
  MoodFilter,
  TransformState,
} from '../types/clothing'

const DEFAULT_TRANSFORM: TransformState = {
  scale: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  opacity: 0.95,
}

interface SavedLook {
  id: string
  url: string
  mood: MoodFilter
  title: string
}

const moodAccent: Record<MoodFilter, string> = {
  all: 'bg-ink text-white',
  chill: 'bg-ocean text-white',
  sporty: 'bg-lime-500 text-ink',
  bold: 'bg-rose-500 text-white',
  business: 'bg-slate-800 text-white',
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export default function FittingRoomPage() {
  const [activeMood, setActiveMood] = useState<MoodFilter>('all')
  const [selectedItem, setSelectedItem] = useState<ClothingItem | undefined>(
    CLOTHING_ITEMS[0],
  )
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const filteredItems = useMemo(
    () =>
      activeMood === 'all'
        ? CLOTHING_ITEMS
        : CLOTHING_ITEMS.filter((item) => item.mood === activeMood),
    [activeMood],
  )

  useEffect(() => {
    if (
      activeMood !== 'all' &&
      selectedItem &&
      selectedItem.mood !== activeMood
    ) {
      const replacement = filteredItems[0]
      setSelectedItem(replacement)
    }
  }, [activeMood, filteredItems, selectedItem])

  const handleMoodChange = (mood: MoodFilter) => {
    setActiveMood(mood)
    if (mood === 'all') return
    const firstMatch = CLOTHING_ITEMS.find((item) => item.mood === mood)
    if (firstMatch) {
      setSelectedItem(firstMatch)
    }
  }

  const handleTransformChange = (field: keyof TransformState, value: number) =>
    setTransform((prev) => ({ ...prev, [field]: value }))

  const resetTransform = () => setTransform(DEFAULT_TRANSFORM)

  const handleSelectItem = (item: ClothingItem) => setSelectedItem(item)

  const handleExport = async () => {
    if (!videoRef.current || !canvasRef.current) return
    if (isExporting) return
    const video = videoRef.current
    const frameRect = canvasRef.current.getBoundingClientRect()
    const width = video.videoWidth || Math.round(frameRect.width)
    const height = video.videoHeight || Math.round(frameRect.height)
    if (!width || !height) return

    setIsExporting(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(video, 0, 0, width, height)

      if (selectedItem) {
        const garment = await loadImage(selectedItem.imageSrc)
        const offsetXRatio = width / frameRect.width
        const offsetYRatio = height / frameRect.height
        const garmentWidth = width * BASE_WIDTH_RATIO * transform.scale
        const garmentHeight =
          garmentWidth * (garment.naturalHeight / garment.naturalWidth)

        ctx.save()
        ctx.translate(
          width / 2 + transform.offsetX * offsetXRatio,
          height / 2 + transform.offsetY * offsetYRatio,
        )
        ctx.rotate((transform.rotation * Math.PI) / 180)
        ctx.globalAlpha = transform.opacity
        ctx.drawImage(
          garment,
          -garmentWidth / 2,
          -garmentHeight / 2,
          garmentWidth,
          garmentHeight,
        )
        ctx.restore()
        ctx.globalAlpha = 1
      }

      const dataUrl = canvas.toDataURL('image/png')
      const moodForExport: MoodFilter = selectedItem?.mood ?? 'all'
      const downloadName = `mood-wardrobe-${moodForExport}.png`
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = downloadName
      link.click()

      const lookId =
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}`

      setSavedLooks((prev) =>
        [
          {
            id: lookId,
            url: dataUrl,
            mood: moodForExport,
            title: selectedItem?.title ?? 'Mood look',
          },
          ...prev,
        ].slice(0, 4),
      )
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Mood Wardrobe
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Онлайн примерочная под любое настроение
          </h1>
        </div>
      </header>

      {cameraError && (
        <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {cameraError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <FittingCanvas
            videoRef={videoRef}
            canvasRef={canvasRef}
            selectedItem={selectedItem}
            transform={transform}
            activeMood={activeMood}
            onCameraError={setCameraError}
          />
        </div>

        <div className="space-y-4 lg:sticky lg:top-10">
          <ClothesCatalog
            items={filteredItems}
            activeMood={activeMood}
            selectedId={selectedItem?.id}
            onMoodChange={handleMoodChange}
            onSelect={handleSelectItem}
          />

          <ControlsPanel
            transform={transform}
            activeMood={activeMood}
            onChange={handleTransformChange}
            onReset={resetTransform}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-3xl p-4 shadow-card sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Экспорт
            </p>
            <h3 className="text-xl font-semibold">Скачать результат</h3>
            <p className="text-sm text-slate-600">
              PNG с текущим кадром камеры и выбранной одеждой.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? 'Готовим...' : 'Скачать PNG'}
            </button>
          </div>
        </div>

        {savedLooks.length > 0 && (
          <div className="glass-panel rounded-3xl p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  История
                </p>
                <h3 className="text-xl font-semibold">Последние сохранения</h3>
              </div>
              <span className="pill bg-white/90 text-slate-700">
                {savedLooks.length} / 4
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {savedLooks.map((look) => (
                <div
                  key={look.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white/80 shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={look.url}
                      alt={look.title}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`pill absolute left-2 top-2 ${moodAccent[look.mood]}`}
                    >
                      {look.mood}
                    </span>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-ink">
                      {look.title}
                    </p>
                    <p className="text-xs text-slate-500">PNG export</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
