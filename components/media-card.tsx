'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MediaItem, STATUS_LABELS, STATUS_COLORS } from '@/lib/types'
import { Star, Play, Pause, CheckCircle, Clock, X, MoreVertical, Pencil, Trash2 } from 'lucide-react'
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
}

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const statusIcon = {
    terminado: <CheckCircle className="w-3 h-3" />,
    saliendo: <Play className="w-3 h-3" />,
    en_espera: <Clock className="w-3 h-3" />,
    cancelado: <X className="w-3 h-3" />,
    no_empezado: <Pause className="w-3 h-3" />
  }

  return (
    <Card className="group border-2 border-border hover:border-primary/50 transition-all hover:glow-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={cn('text-xs flex items-center gap-1', STATUS_COLORS[item.status])}
              >
                {statusIcon[item.status]}
                {STATUS_LABELS[item.status]}
              </Badge>
              
              {item.score && (
                <Badge variant="outline" className="text-xs flex items-center gap-1 border-warning text-warning">
                  <Star className="w-3 h-3 fill-current" />
                  {item.score}/10
                </Badge>
              )}
              
              {item.is_up_to_date && (
                <Badge variant="outline" className="text-xs border-success text-success">
                  Al dia
                </Badge>
              )}
            </div>
            
            {item.last_episode && (
              <p className="text-xs text-muted-foreground mt-2">
                Ultimo: {item.last_episode}
              </p>
            )}
            
            {item.dropped_at && (
              <p className="text-xs text-destructive mt-1">
                Dejado en: {item.dropped_at}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
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
      </CardContent>
    </Card>
  )
}
