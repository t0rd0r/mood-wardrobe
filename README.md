# Mood Wardrobe — Fitting Room

Страница примерки с камерой, фильтрами по mood и быстрым экспортом PNG.

## Стек

- React + TypeScript (Vite)
- TailwindCSS
- WebRTC/getUserMedia
- Canvas-экспорт PNG

## Запуск

1. Node.js >= 20.19 (используется npm).
2. Установить зависимости: `npm install`
3. Старт dev-сервера: `npm run dev`
4. Сборка прод-версии: `npm run build`
5. Превью собранного билда: `npm run preview`

## Что реализовано

- Страница `/fitting-room` как главный вход.
- Блок камеры (`CameraCapture`): запрос доступа, живой поток, статус Live/ошибка, кнопка перезапуска, понятные сообщения при запрете камеры.
- Каталог (`ClothesCatalog`): 8 вещей с захардкоженными данными и PNG из `public/clothing`. Фильтры All/Chill/Sporty/Bold/Business, подсветка активного mood, выбор вещи для примерки.
- Область примерки (`FittingCanvas`): слой пользователя + слой одежды с плавным появлением. Бейдж текущего mood.
- Панель управления (`ControlsPanel`): слайдеры scale, rotation, offset X/Y, opacity, мгновенное применение, Reset.
- Экспорт результата: кнопка «Скачать PNG» собирает кадр камеры + выбранную одежду (учитываются трансформации). Сохранённые превью последних 4 экспортов.
- UI: светлая минималистичная стилистика, адаптивная сетка (desktop/mobile), акцентированные mood-чипы.

## Структура

```
src/
  components/CameraCapture.tsx
  components/ClothesCatalog.tsx
  components/ControlsPanel.tsx
  components/FittingCanvas.tsx
  data/clothing.ts
  pages/fitting-room.tsx
  types/clothing.ts
```

Изображения одежды лежат в `public/clothing/*` и подхватываются по относительным путям.

## Технические заметки

- Экспорт выполняется через `<canvas>`: сначала кадр видео, затем выбранная вещь с учётом scale/rotation/offset/opacity. Если камера не готова, экспорт просто не стартует.
- При смене mood активный элемент каталога автоматически переключается на первую вещь из выбранного mood.
- Для корректной работы камеры нужно дать разрешение браузеру; при ошибке выводится подсказка по включению доступа.
