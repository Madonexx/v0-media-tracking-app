'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Achievement } from '@/lib/types'
import { Trophy, Tv, BookOpen, Film, Gamepad2, Zap, Library, Star, CalendarCheck, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AchievementCardProps {
  achievement: Achievement
  unlocked?: boolean
  unlockedAt?: string
}

const iconMap: Record<string, React.ReactNode> = {
  'trophy': <Trophy className="w-6 h-6" />,
  'tv': <Tv className="w-6 h-6" />,
  'book-open': <BookOpen className="w-6 h-6" />,
  'film': <Film className="w-6 h-6" />,
  'gamepad-2': <Gamepad2 className="w-6 h-6" />,
  'zap': <Zap className="w-6 h-6" />,
  'library': <Library className="w-6 h-6" />,
  'star': <Star className="w-6 h-6" />,
  'calendar-check': <CalendarCheck className="w-6 h-6" />,
}

export function AchievementCard({ achievement, unlocked = false, unlockedAt }: AchievementCardProps) {
  return (
    <Card 
      className={cn(
        'border-2 transition-all',
        unlocked 
          ? 'border-warning/50 glow-primary achievement-unlock' 
          : 'border-border/30 opacity-50 grayscale'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div 
            className={cn(
              'p-3 rounded-lg',
              unlocked ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
            )}
          >
            {unlocked ? (iconMap[achievement.icon] || <Trophy className="w-6 h-6" />) : <Lock className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{achievement.name}</h4>
            <p className="text-sm text-muted-foreground truncate">{achievement.description}</p>
            {unlocked && unlockedAt && (
              <p className="text-xs text-success mt-1">
                Desbloqueado {new Date(unlockedAt).toLocaleDateString('es')}
              </p>
            )}
          </div>
          <div className={cn(
            'text-sm font-bold',
            unlocked ? 'text-warning' : 'text-muted-foreground'
          )}>
            +{achievement.points}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
