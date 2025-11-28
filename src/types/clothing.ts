export type Mood = 'chill' | 'sporty' | 'bold' | 'business'

export type MoodFilter = Mood | 'all'

export interface ClothingItem {
  id: string
  title: string
  imageSrc: string
  mood: Mood
}

export interface TransformState {
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
  opacity: number
}
