'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, Achievement, UserAchievement, MediaType, Profile } from '@/lib/types'
import { Navigation } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { MediaList } from '@/components/media-list'
import { AchievementsList } from '@/components/achievements-list'
import { SettingsDialog } from '@/components/settings-dialog'
import { Spinner } from '@/components/ui/spinner'

type TabType = 'dashboard' | 'achievements' | MediaType

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [items, setItems] = useState<MediaItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const fetchData = useCallback(async (userId: string) => {
    // Only fetch profile if we don't have it or need update
    const [itemsRes, achievementsRes, userAchievementsRes, profileRes] = await Promise.all([
      supabase.from('media_items').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
      supabase.from('achievements').select('*'),
      supabase.from('user_achievements').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ])
    
    // Map database fields to our expected MediaItem type
    const mappedItems = (itemsRes.data || []).map((item: any) => ({
      ...item,
      content_status: item.content_status || item.status || 'no_empezado',
      user_progress: item.user_progress || (item.is_watching ? 'viendo' : (item.status === 'terminado' ? 'completado' : 'pendiente'))
    }))
    
    setItems(mappedItems)
    setAchievements(achievementsRes.data || [])
    setUserAchievements(userAchievementsRes.data || [])
    setProfile(profileRes.data)
    setLoading(false)
  }, [supabase])

  const checkAndUnlockAchievements = useCallback(async () => {
    if (!user) return
    
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
            i.user_progress === 'completado' && 
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
        await supabase.from('user_achievements').insert({ 
          achievement_id: achievement.id,
          user_id: user.id 
        })
      }
    }
    
    // Refetch user achievements after potential unlocks
    const { data } = await supabase.from('user_achievements').select('*').eq('user_id', user.id)
    if (data) setUserAchievements(data)
  }, [items, achievements, userAchievements, supabase, user])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchData(session.user.id)
      }
    }
    checkUser()
  }, [supabase, router, fetchData])

  useEffect(() => {
    if (items.length > 0 && achievements.length > 0 && user) {
      checkAndUnlockAchievements()
    }
  }, [items.length, achievements.length, checkAndUnlockAchievements, user])

  const handleRefresh = () => {
    if (user) fetchData(user.id)
  }

  if (loading || !user) {
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
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        enabledCategories={profile?.enabled_categories}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        profile={profile}
        onUpdate={handleRefresh}
      />
    </div>
  )
}
