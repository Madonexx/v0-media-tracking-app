'use client'

import { Achievement, UserAchievement } from '@/lib/types'
import { AchievementCard } from './achievement-card'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Lock, Unlock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface AchievementsListProps {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
}

export function AchievementsList({ achievements, userAchievements }: AchievementsListProps) {
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id))
  const unlockedCount = userAchievements.length
  const totalCount = achievements.length
  const totalPoints = achievements
    .filter(a => unlockedIds.has(a.id))
    .reduce((acc, a) => acc + a.points, 0)
  const maxPoints = achievements.reduce((acc, a) => acc + a.points, 0)
  
  const unlockedAchievements = achievements.filter(a => unlockedIds.has(a.id))
  const lockedAchievements = achievements.filter(a => !unlockedIds.has(a.id))

  return (
    <div className="space-y-8">
      {/* Stats Banner */}
      <Card className="border-2 border-warning/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warning/30 to-primary/30 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalPoints} XP</p>
                <p className="text-muted-foreground">de {maxPoints} XP posibles</p>
              </div>
            </div>
            
            <div className="flex gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 text-success">
                  <Unlock className="w-5 h-5" />
                  <span className="text-2xl font-bold">{unlockedCount}</span>
                </div>
                <p className="text-sm text-muted-foreground">Desbloqueados</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                  <span className="text-2xl font-bold">{totalCount - unlockedCount}</span>
                </div>
                <p className="text-sm text-muted-foreground">Bloqueados</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso total</span>
              <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>
      
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5 text-success" />
            Logros Desbloqueados ({unlockedAchievements.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={true}
                unlockedAt={userAchievements.find(ua => ua.achievement_id === achievement.id)?.unlocked_at}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            Logros por Desbloquear ({lockedAchievements.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {lockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
