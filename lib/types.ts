export type MediaType = 'anime' | 'series' | 'movie' | 'book' | 'game'

// Estado del contenido (si el anime/serie terminó de emitirse, está en emisión, etc.)
export type ContentStatus = 'terminado' | 'saliendo' | 'en_espera' | 'cancelado' | 'no_empezado'

// Progreso del usuario (si vos lo terminaste de ver, lo estás viendo, etc.)
export type UserProgress = 'completado' | 'viendo' | 'en_pausa' | 'abandonado' | 'pendiente'

export interface Profile {
  id: string
  username: string | null
  enabled_categories: MediaType[]
  is_public: boolean
  share_slug: string | null
  created_at: string
  updated_at: string
}

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  score: number | null
  content_status: ContentStatus
  user_progress: UserProgress
  is_watching: boolean
  is_up_to_date: boolean
  dropped_at: string | null
  last_episode: string | null
  current_progress: number
  total_progress: number | null
  is_platinum?: boolean
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

// Labels for content status (estado del contenido)
export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  terminado: 'Finalizado',
  saliendo: 'En emisión',
  en_espera: 'Por estrenar',
  cancelado: 'Cancelado',
  no_empezado: 'Desconocido'
}

// Labels for user progress (mi progreso)
export const USER_PROGRESS_LABELS: Record<UserProgress, string> = {
  completado: 'Completado',
  viendo: 'Viendo',
  en_pausa: 'En pausa',
  abandonado: 'Abandonado',
  pendiente: 'Pendiente'
}

export const TYPE_LABELS: Record<MediaType, string> = {
  anime: 'Anime',
  series: 'Series',
  movie: 'Películas',
  book: 'Libros',
  game: 'Juegos'
}

// Colors for content status badges
export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  terminado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  saliendo: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  en_espera: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cancelado: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  no_empezado: 'bg-muted text-muted-foreground border-muted'
}

// Colors for user progress (more prominent)
export const USER_PROGRESS_COLORS: Record<UserProgress, string> = {
  completado: 'bg-success text-success-foreground',
  viendo: 'bg-primary text-primary-foreground',
  en_pausa: 'bg-warning text-warning-foreground',
  abandonado: 'bg-destructive text-destructive-foreground',
  pendiente: 'bg-muted text-muted-foreground'
}

// Border colors for card left accent (based on user progress)
export const PROGRESS_BORDER_COLORS: Record<UserProgress, string> = {
  completado: 'border-l-success',
  viendo: 'border-l-primary',
  en_pausa: 'border-l-warning',
  abandonado: 'border-l-destructive',
  pendiente: 'border-l-muted-foreground/30'
}

// Vocabulary Helpers
export const getMediaProgressLabel = (progress: UserProgress, type: MediaType): string => {
  if (progress === 'viendo') {
    switch (type) {
      case 'book': return 'Leyendo';
      case 'game': return 'Jugando';
      case 'movie': return 'Visto';
      default: return 'Viendo';
    }
  }
  if (progress === 'completado') {
    switch (type) {
      case 'book': return 'Leído';
      case 'movie': return 'Visto';
      case 'game': return 'Terminado';
      default: return 'Completado';
    }
  }
  return USER_PROGRESS_LABELS[progress];
}

export const getMediaUnitLabel = (type: MediaType): string => {
  switch (type) {
    case 'book': return 'págs';
    case 'game': return 'hs';
    case 'anime':
    case 'series': return 'eps';
    default: return '';
  }
}

export const getMediaActionLabel = (type: MediaType): string => {
  switch (type) {
    case 'book': return 'Leer';
    case 'game': return 'Jugar';
    default: return 'Ver';
  }
}

// Glow effects for user progress
export const PROGRESS_GLOW: Record<UserProgress, string> = {
  completado: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
  viendo: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]',
  en_pausa: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]',
  abandonado: '',
  pendiente: ''
}
