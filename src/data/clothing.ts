import type { ClothingItem, Mood } from '../types/clothing'

export const MOODS: { label: string; value: Mood }[] = [
  { label: 'Chill', value: 'chill' },
  { label: 'Sporty', value: 'sporty' },
  { label: 'Bold', value: 'bold' },
  { label: 'Business', value: 'business' },
]

export const CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 'chill-hoodie',
    title: 'Cloud Hoodie',
    imageSrc: '/clothing/chill/chill.PNG',
    mood: 'chill',
  },
  {
    id: 'chill-layer',
    title: 'Layered Knit',
    imageSrc: '/clothing/chill/chill.PNG',
    mood: 'chill',
  },
  {
    id: 'sporty-top',
    title: 'Arena Jacket',
    imageSrc: '/clothing/sporty/sporty.PNG',
    mood: 'sporty',
  },
  {
    id: 'sporty-set',
    title: 'Sprint Set',
    imageSrc: '/clothing/sporty/sporty.PNG',
    mood: 'sporty',
  },
  {
    id: 'bold-dress',
    title: 'Statement Dress',
    imageSrc: '/clothing/bold/IMG_5667.PNG',
    mood: 'bold',
  },
  {
    id: 'bold-suit',
    title: 'Red Carpet Suit',
    imageSrc: '/clothing/bold/IMG_5667.PNG',
    mood: 'bold',
  },
  {
    id: 'business-blazer',
    title: 'Boardroom Blazer',
    imageSrc: '/clothing/business/bussines.PNG',
    mood: 'business',
  },
  {
    id: 'business-dress',
    title: 'Power Dress',
    imageSrc: '/clothing/business/bussines.PNG',
    mood: 'business',
  },
]
