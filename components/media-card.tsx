'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MediaItem, STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from '@/lib/types'
import { Star, Play, Pause, CheckCircle, Clock, X, MoreVertical, Pencil, Trash2, ImageIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface MediaCardProps {
  item: MediaItem
  onEdit?: (item: MediaItem) => void
  onDelete?: (item: MediaItem) => void
  compact?: boolean
}

export function MediaCard({ item, onEdit, onDelete, compact = false }: MediaCardProps) {
  const statusIcon = {
    terminado: <CheckCircle className="w-3 h-3" />,
    saliendo: <Play className="w-3 h-3" />,
    en_espera: <Clock className="w-3 h-3" />,
    cancelado: <X className="w-3 h-3" />,
    no_empezado: <Pause className="w-3 h-3" />
  }

  const typeIcon = {
    anime: '🎬',
    series: '📺',
    movie: '🎥',
    book: '📚',
    game: '🎮'
  }

  if (compact) {
    return (
      <Card className="group border border-border hover:border-primary/50 transition-all">
        <CardContent className="p-3 flex items-center gap-3">
          {/* Small image */}
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
              <Badge variant="secondary" className={cn('text-[10px] px-1.5', STATUS_COLORS[item.status])}>
                {STATUS_LABELS[item.status]}
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
    <Card className="group border-2 border-border hover:border-primary/50 transition-all hover:glow-primary overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image section */}
          <div className="w-24 h-36 flex-shrink-0 bg-muted relative overflow-hidden">
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
            {/* Type badge overlay */}
            <div className="absolute top-1 left-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-background/80 backdrop-blur-sm">
                {TYPE_LABELS[item.type]}
              </Badge>
            </div>
          </div>
          
          {/* Info section */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(item)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className={cn('text-[10px] px-1.5 py-0 flex items-center gap-0.5', STATUS_COLORS[item.status])}
                >
                  {statusIcon[item.status]}
                  {STATUS_LABELS[item.status]}
                </Badge>
                
                {item.score && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex items-center gap-0.5 border-warning text-warning">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {item.score}
                  </Badge>
                )}
                
                {item.is_up_to_date && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-success text-success">
                    Al dia
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mt-2">
              {item.last_episode && (
                <p className="text-[11px] text-muted-foreground truncate">
                  Ultimo: {item.last_episode}
                </p>
              )}
              
              {item.dropped_at && (
                <p className="text-[11px] text-destructive truncate">
                  Dejado en: {item.dropped_at}
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
