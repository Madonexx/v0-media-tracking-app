export type MediaType = 'anime' | 'series' | 'movie' | 'book' | 'game'

export type MediaStatus = 'terminado' | 'saliendo' | 'en_espera' | 'cancelado' | 'no_empezado'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  score: number | null
  status: MediaStatus
  is_watching: boolean
  is_up_to_date: boolean
  dropped_at: string | null
  last_episode: string | null
  notes: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition_type: string
  condition_value: Record<string, unknown>
  points: number
  created_at: string
}

export interface UserAchievement {
  id: string
  achievement_id: string
  unlocked_at: string
  achievement?: Achievement
}

export const STATUS_LABELS: Record<MediaStatus, string> = {
  terminado: 'Terminado',
  saliendo: 'En emision',
  en_espera: 'En espera',
  cancelado: 'Cancelado',
  no_empezado: 'No empezado'
}

export const TYPE_LABELS: Record<MediaType, string> = {
  anime: 'Anime',
  series: 'Series',
  movie: 'Peliculas',
  book: 'Libros',
  game: 'Juegos'
}

export const STATUS_COLORS: Record<MediaStatus, string> = {
  terminado: 'bg-success text-success-foreground',
  saliendo: 'bg-primary text-primary-foreground',
  en_espera: 'bg-warning text-warning-foreground',
  cancelado: 'bg-destructive text-destructive-foreground',
  no_empezado: 'bg-muted text-muted-foreground'
}
