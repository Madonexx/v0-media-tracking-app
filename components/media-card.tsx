'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  MediaItem, 
  CONTENT_STATUS_LABELS, 
  CONTENT_STATUS_COLORS,
  USER_PROGRESS_LABELS,
  USER_PROGRESS_COLORS,
  PROGRESS_BORDER_COLORS, 
  PROGRESS_GLOW, 
  TYPE_LABELS 
} from '@/lib/types'
import { Star, Play, Pause, CheckCircle, Clock, X, MoreVertical, Pencil, Trash2, ImageIcon, Eye, BookOpen, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface MediaCardProps {
  item: MediaItem
  onEdit?: (item: MediaItem) => void
  onDelete?: (item: MediaItem) => void
  compact?: boolean
  readOnly?: boolean
}

export function MediaCard({ item, onEdit, onDelete, compact = false, readOnly = false }: MediaCardProps) {
  const [localProgress, setLocalProgress] = useState(item.current_progress || 0)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card's click (edit)
    if (updating || readOnly) return
    
    setUpdating(true)
    const nextProgress = localProgress + 1
    
    // Optimistic update
    setLocalProgress(nextProgress)

    const updateData: any = {
      current_progress: nextProgress,
      updated_at: new Date().toISOString()
    }

    if (item.total_progress && nextProgress >= item.total_progress) {
      updateData.user_progress = 'completado'
    }

    const { error } = await supabase
      .from('media_items')
      .update(updateData)
      .eq('id', item.id)

    if (error) {
      console.error('Error updating progress:', error)
      setLocalProgress(localProgress) // Rollback
    }
    setUpdating(false)
  }

  const typeIcon = {
    anime: '🎬',
    series: '📺',
    movie: '🎥',
    book: '📚',
    game: '🎮'
  }

  const progressPercent = item.total_progress 
    ? Math.min(Math.round((localProgress / item.total_progress) * 100), 100)
    : 0

  if (compact) {
    return (
      <Card className="group border border-border hover:border-primary/50 transition-all">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="w-10 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">
                {typeIcon[item.type]}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={cn('text-[10px] px-1.5', USER_PROGRESS_COLORS[item.user_progress])}>
                {USER_PROGRESS_LABELS[item.user_progress]}
              </Badge>
              {item.score && (
                <span className="text-xs text-warning flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  {item.score}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "group border-2 border-border hover:border-primary/50 transition-all overflow-hidden border-l-4 relative",
        PROGRESS_BORDER_COLORS[item.user_progress],
        PROGRESS_GLOW[item.user_progress],
        !readOnly && "cursor-pointer active:scale-[0.98]",
        item.user_progress === 'abandonado' && "opacity-60 hover:opacity-100",
        item.user_progress === 'viendo' && "ring-1 ring-primary/30"
      )}
      onClick={() => !readOnly && onEdit?.(item)}
    >
      <CardContent className="p-0">
        <div className="flex relative">
          {/* User progress badge - MOVED TO LEFT */}
          <div className="absolute top-0 left-0 z-10">
            <div className={cn(
              "text-[9px] font-bold px-2 py-0.5 rounded-br-lg flex items-center gap-1",
              USER_PROGRESS_COLORS[item.user_progress]
            )}>
              {item.user_progress === 'viendo' && <Play className="w-2.5 h-2.5 fill-current" />}
              {item.user_progress === 'completado' && <CheckCircle className="w-2.5 h-2.5" />}
              {USER_PROGRESS_LABELS[item.user_progress].toUpperCase()}
            </div>
          </div>

          {/* Image section */}
          <div className="w-24 h-40 flex-shrink-0 bg-muted relative overflow-hidden">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-1">
                <ImageIcon className="w-8 h-8 opacity-50" />
                <span className="text-[10px]">Sin imagen</span>
              </div>
            )}
            {/* Type badge overlay - bottom right of image */}
            <div className="absolute bottom-1 right-1">
              <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-background/80 backdrop-blur-sm h-4">
                {TYPE_LABELS[item.type]}
              </Badge>
            </div>
          </div>
          
          {/* Info section */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={cn('text-[10px] px-1.5 py-0 flex items-center gap-0.5 border h-4', CONTENT_STATUS_COLORS[item.content_status])}
                >
                  {CONTENT_STATUS_LABELS[item.content_status]}
                </Badge>
                
                {item.score && (
                  <div className="flex items-center text-warning drop-shadow-sm">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    <span className="text-[10px] font-bold">{item.score}</span>
                  </div>
                )}
              </div>

              {/* Progress Tracker UI */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    Progreso: <span className="text-foreground font-bold">{localProgress}</span>
                    {item.total_progress ? ` / ${item.total_progress}` : ''}
                  </div>
                  {!readOnly && item.user_progress !== 'completado' && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-6 w-6 border-primary/30 text-primary hover:bg-primary hover:text-white"
                      onClick={handleIncrement}
                      disabled={updating}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {item.total_progress && (
                  <Progress value={progressPercent} className="h-1.5 bg-secondary" />
                )}
              </div>
            </div>
            
            <div className="mt-1">
              {item.last_episode && !item.total_progress && (
                <p className="text-[10px] text-muted-foreground truncate italic">
                  {item.last_episode}
                </p>
              )}
              
              {item.notes && (
                <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
