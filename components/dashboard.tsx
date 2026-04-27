'use client'

import { MediaItem, Achievement, UserAchievement, TYPE_LABELS, MediaType, UserProgress } from '@/lib/types'
import { StatsCard } from './stats-card'
import { AchievementCard } from './achievement-card'
import { MediaCard } from './media-card'
import { Library, CheckCircle, Play, Star, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface DashboardProps {
  items: MediaItem[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  onStatClick?: (tab: string, filters?: UserProgress[]) => void
  onEditItem?: (item: MediaItem) => void
  readOnly?: boolean
}

export function Dashboard({ items, achievements, userAchievements, onStatClick, onEditItem, readOnly = false }: DashboardProps) {
  const totalItems = items.length
  const completedItems = items.filter(i => i.user_progress === 'completado').length
  const watchingItems = items.filter(i => i.user_progress === 'viendo').length
  const avgScore = items.filter(i => i.score).reduce((acc, i) => acc + (i.score || 0), 0) / 
    (items.filter(i => i.score).length || 1)
  
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id))
  const totalPoints = achievements
    .filter(a => unlockedIds.has(a.id))
    .reduce((acc, a) => acc + a.points, 0)
  
  const recentItems = [...items]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6)
  
  // Get first available media type from user's items to use as fallback for stat redirects
  const firstMediaType = items.length > 0 ? items[0].type : 'anime'
  
  // Calculate stats by type
  const statsByType = Object.keys(TYPE_LABELS).map(type => ({
    type: type as keyof typeof TYPE_LABELS,
    label: TYPE_LABELS[type as keyof typeof TYPE_LABELS],
    count: items.filter(i => i.type === type).length,
    completed: items.filter(i => i.type === type && i.user_progress === 'completado').length
  }))

  return (
    <div className="space-y-8">
      {/* XP / Points Banner */}
      <Card className="border-2 border-primary/30 glow-primary overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Puntos de Experiencia</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalPoints} XP
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {userAchievements.length} de {achievements.length} logros desbloqueados
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          </div>
          <Progress 
            value={(userAchievements.length / (achievements.length || 1)) * 100} 
            className="mt-4 h-2"
          />
        </CardContent>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total en Biblioteca"
          value={totalItems}
          icon={<Library className="w-5 h-5" />}
          color="primary"
          onClick={() => onStatClick?.(firstMediaType, [])}
        />
        <StatsCard
          title="Completados"
          value={completedItems}
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
          subtitle={`${Math.round((completedItems / (totalItems || 1)) * 100) || 0}% del total`}
          onClick={() => onStatClick?.(firstMediaType, ['completado'])}
        />
        <StatsCard
          title="Viendo Ahora"
          value={watchingItems}
          icon={<Play className="w-5 h-5" />}
          color="accent"
          onClick={() => onStatClick?.(firstMediaType, ['viendo'])}
        />
        <StatsCard
          title="Puntuacion Media"
          value={avgScore.toFixed(1)}
          icon={<Star className="w-5 h-5" />}
          color="warning"
        />
      </div>
      
      {/* Content by Type */}
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Contenido por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statsByType.map(({ type, label, count, completed }) => (
              <div 
                key={type} 
                className={cn(
                  "space-y-2 p-2 rounded-lg transition-colors",
                  count > 0 && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => count > 0 && onStatClick?.(type, [])}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground text-xs">
                    {completed}/{count} completados
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${count > 0 ? (completed / count) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity & Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <MediaCard 
                  key={item.id} 
                  item={item} 
                  onEdit={onEditItem}
                  readOnly={readOnly}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm italic">
                No hay actividad reciente
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-warning" />
              Logros Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3">
            {achievements.slice(0, 4).map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.has(achievement.id)}
                unlockedAt={userAchievements.find(ua => ua.achievement_id === achievement.id)?.unlocked_at}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
