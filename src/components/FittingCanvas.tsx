import type { CSSProperties } from 'react'
import type { ClothingItem, MoodFilter, TransformState } from '../types/clothing'
import CameraCapture from './CameraCapture'

export const BASE_WIDTH_RATIO = 0.65

const moodTone: Record<MoodFilter, string> = {
  all: 'bg-white/80 text-slate-700',
  chill: 'bg-ocean/15 text-ocean',
  sporty: 'bg-lime/20 text-lime-700',
  bold: 'bg-blush/20 text-rose-600',
  business: 'bg-slate-200 text-slate-800',
}

interface FittingCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLDivElement | null>
  selectedItem?: ClothingItem
  transform: TransformState
  activeMood: MoodFilter
  onCameraError: (message: string | null) => void
}

export default function FittingCanvas({
  videoRef,
  canvasRef,
  selectedItem,
  transform,
  activeMood,
  onCameraError,
}: FittingCanvasProps) {
  const overlayStyle: CSSProperties = {
    width: `${BASE_WIDTH_RATIO * 100}%`,
    transform: `translate(-50%, -50%) translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
    opacity: transform.opacity,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Область примерки
          </p>
          <h2 className="text-2xl font-semibold">Mood Canvas</h2>
        </div>
        <span className={`pill ${moodTone[activeMood]}`}>
          Mood: <span className="capitalize">{activeMood}</span>
        </span>
      </div>

      <CameraCapture
        containerRef={canvasRef}
        videoRef={videoRef}
        onError={onCameraError}
        overlay={
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-white/5" />
            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Live fitting
            </div>
            {selectedItem ? (
              <img
                key={selectedItem.id}
                src={selectedItem.imageSrc}
                alt={selectedItem.title}
                style={overlayStyle}
                className="absolute left-1/2 top-1/2 origin-center drop-shadow-2xl transition-all duration-300 ease-out animate-fadeIn pointer-events-none"
              />
            ) : (
              <div className="absolute left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm font-semibold text-slate-500">
                Выберите одежду из каталога, чтобы примерить её поверх камеры.
              </div>
            )}
          </>
        }
      />
    </div>
  )
}
