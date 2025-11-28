import { useCallback, useEffect, useRef, useState } from 'react'

type CameraStatus = 'idle' | 'loading' | 'ready' | 'error'

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  containerRef?: React.RefObject<HTMLDivElement | null>
  overlay?: React.ReactNode
  onError?: (message: string | null) => void
  onStatusChange?: (status: CameraStatus) => void
}

const errorCopy =
  'Разрешите доступ к камере в настройках браузера и перезапустите модуль.'

export default function CameraCapture({
  videoRef,
  containerRef,
  overlay,
  onError,
  onStatusChange,
}: CameraCaptureProps) {
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    setStatus('loading')
    setMessage(null)
    onStatusChange?.('loading')
    try {
      stopStream()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
      setStatus('ready')
      onStatusChange?.('ready')
      onError?.(null)
    } catch (error) {
      const friendly =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? errorCopy
          : 'Не удалось запустить камеру. Проверьте устройство и попробуйте снова.'
      setMessage(friendly)
      setStatus('error')
      onStatusChange?.('error')
      onError?.(friendly)
    }
  }, [onError, onStatusChange, stopStream, videoRef])

  useEffect(() => {
    startCamera()
    return () => stopStream()
  }, [startCamera, stopStream])

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl glass-panel"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {overlay}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/40 ring-offset-0" />
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'ready'
                ? 'bg-emerald-500'
                : status === 'loading'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
            }`}
          />
          {status === 'ready'
            ? 'Live'
            : status === 'loading'
              ? 'Запрос камеры...'
              : 'Отключено'}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          {message ?? 'Камера включена. Держите ракурс ровно для примерки.'}
        </div>
        <button
          type="button"
          onClick={startCamera}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-lg"
        >
          Перезапустить камеру
        </button>
      </div>
    </div>
  )
}
