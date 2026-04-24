'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, Achievement, UserAchievement, MediaType } from '@/lib/types'
import { Navigation } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { MediaList } from '@/components/media-list'
import { AchievementsList } from '@/components/achievements-list'
import { Spinner } from '@/components/ui/spinner'

type TabType = 'dashboard' | 'achievements' | MediaType

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [items, setItems] = useState<MediaItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [itemsRes, achievementsRes, userAchievementsRes] = await Promise.all([
      supabase.from('media_items').select('*').order('updated_at', { ascending: false }),
      supabase.from('achievements').select('*'),
      supabase.from('user_achievements').select('*')
    ])
    
    setItems(itemsRes.data || [])
    setAchievements(achievementsRes.data || [])
    setUserAchievements(userAchievementsRes.data || [])
    setLoading(false)
  }, [supabase])

  const checkAndUnlockAchievements = useCallback(async () => {
    const currentItems = items
    const currentAchievements = achievements
    const currentUnlocked = new Set(userAchievements.map(ua => ua.achievement_id))
    
    for (const achievement of currentAchievements) {
      if (currentUnlocked.has(achievement.id)) continue
      
      let shouldUnlock = false
      const condition = achievement.condition_value as Record<string, unknown>
      
      switch (achievement.condition_type) {
        case 'count_total':
          shouldUnlock = currentItems.length >= (condition.min as number)
          break
        case 'count_completed':
          const typeFilter = condition.type as string | undefined
          const completedCount = currentItems.filter(i => 
            i.status === 'terminado' && 
            (!typeFilter || i.type === typeFilter)
          ).length
          shouldUnlock = completedCount >= (condition.min as number)
          break
        case 'count_score':
          const scoreCount = currentItems.filter(i => i.score === (condition.score as number)).length
          shouldUnlock = scoreCount >= (condition.min as number)
          break
        case 'count_up_to_date':
          const upToDateCount = currentItems.filter(i => i.is_up_to_date).length
          shouldUnlock = upToDateCount >= (condition.min as number)
          break
      }
      
      if (shouldUnlock) {
        await supabase.from('user_achievements').insert({ achievement_id: achievement.id })
      }
    }
    
    // Refetch user achievements after potential unlocks
    const { data } = await supabase.from('user_achievements').select('*')
    if (data) setUserAchievements(data)
  }, [items, achievements, userAchievements, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (items.length > 0 && achievements.length > 0) {
      checkAndUnlockAchievements()
    }
  }, [items.length, achievements.length, checkAndUnlockAchievements])

  const handleRefresh = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando tu biblioteca...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            items={items} 
            achievements={achievements} 
            userAchievements={userAchievements} 
          />
        )
      case 'achievements':
        return (
          <AchievementsList 
            achievements={achievements} 
            userAchievements={userAchievements} 
          />
        )
      default:
        return (
          <MediaList 
            items={items.filter(i => i.type === activeTab)} 
            type={activeTab} 
            onRefresh={handleRefresh}
          />
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
