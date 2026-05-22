'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, Achievement, UserAchievement, MediaType, Profile, UserProgress } from '@/lib/types'
import { Navigation } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { MediaList } from '@/components/media-list'
import { MediaCatalog } from '@/components/media-catalog'
import { AchievementsList } from '@/components/achievements-list'
import { SettingsDialog } from '@/components/settings-dialog'
import { AddMediaDialog } from '@/components/add-media-dialog'
import { Spinner } from '@/components/ui/spinner'

import { RPGCharacterCard } from '@/components/rpg-character-card'

type TabType = 'dashboard' | 'achievements' | 'catalog' | MediaType

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [initialFilters, setInitialFilters] = useState<UserProgress[]>([])
  const [items, setItems] = useState<MediaItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  // Dashboard edit state
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const fetchData = useCallback(async (userId: string) => {
    const [itemsRes, achievementsRes, userAchievementsRes, profileRes] = await Promise.all([
      supabase.from('media_items').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
      supabase.from('achievements').select('*'),
      supabase.from('user_achievements').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ])
    
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
    
    let achievementsAdded = false
    
    for (const achievement of currentAchievements) {
      if (currentUnlocked.has(achievement.id)) continue
      
      let shouldUnlock = false
      const condition = achievement.condition_value as Record<string, unknown>
      
      switch (achievement.condition_type) {
        case 'total_items':
          shouldUnlock = currentItems.length >= (condition.count as number)
          break
        case 'completed_by_type':
          const typeFilter = condition.type as string | undefined
          const completedCount = currentItems.filter(i => 
            i.user_progress === 'completado' && 
            (!typeFilter || i.type === typeFilter)
          ).length
          shouldUnlock = completedCount >= (condition.count as number)
          break
        case 'perfect_score':
          const perfectCount = currentItems.filter(i => i.score === 10).length
          shouldUnlock = perfectCount >= (condition.count as number)
          break
        case 'count_up_to_date':
          shouldUnlock = currentItems.filter(i => i.is_up_to_date).length >= (condition.count as number)
          break
        case 'franchise':
          const franchiseName = (condition.name as string).toLowerCase()
          const franchiseItems = currentItems.filter(i => 
            i.title.toLowerCase().includes(franchiseName) && 
            i.user_progress === 'completado'
          )
          const requiredCount = (condition.count as number) || 1
          shouldUnlock = franchiseItems.length >= requiredCount
          break
        case 'genre':
          const genreName = (condition.name as string).toLowerCase()
          const genreItems = currentItems.filter(i => 
            i.notes?.toLowerCase().includes(genreName) && 
            i.user_progress === 'completado'
          )
          shouldUnlock = genreItems.length >= (condition.count as number)
          break
        case 'platinum_count':
          shouldUnlock = currentItems.filter(i => i.is_platinum).length >= (condition.count as number)
          break
      }
      
      if (shouldUnlock) {
        await supabase.from('user_achievements').insert({ 
          achievement_id: achievement.id,
          user_id: user.id 
        })
        
        // Award XP for achievement
        await supabase.rpc('add_xp', { user_uuid: user.id, xp_to_add: achievement.points || 50 })
        achievementsAdded = true
      }
    }
    
    if (achievementsAdded) {
      const { data } = await supabase.from('user_achievements').select('*').eq('user_id', user.id)
      if (data) setUserAchievements(data)
      // Refresh profile to see new XP/Level
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData)
    }
  }, [items, achievements, userAchievements, supabase, user])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
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

  const handleStatClick = (tab: string, filters: UserProgress[] = []) => {
    setInitialFilters(filters)
    setActiveTab(tab as TabType)
  }

  const handleEditItem = (item: MediaItem) => {
    setEditItem(item)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    handleRefresh()
    setEditItem(null)
  }

  const onTabChange = (tab: TabType) => {
    setInitialFilters([]) // Clear filters when changing tabs normally
    setActiveTab(tab)
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-card border-2 border-primary/30 rounded-2xl max-w-md">
          <h2 className="text-2xl font-bold mb-4">Inicializando Perfil...</h2>
          <p className="text-muted-foreground mb-6">Estamos preparando tu tarjeta de aventurero. Si esto tarda mucho, intenta recargar.</p>
          <Button onClick={handleRefresh} className="glow-primary">Reintentar</Button>
        </div>
      </div>
    )
  }

  const getStats = () => {
    const completed = items.filter(i => i.user_progress === 'completado').length
    const categoriesCount = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topCat = Object.entries(categoriesCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Media'

    return {
      totalItems: items.length,
      completedItems: completed,
      achievementsCount: userAchievements.length,
      topCategory: TYPE_LABELS[topCat as MediaType] || 'N/A'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <RPGCharacterCard profile={profile!} stats={getStats()} />
            <Dashboard 
              items={items} 
              achievements={achievements} 
              userAchievements={userAchievements}
              onStatClick={handleStatClick}
              onEditItem={handleEditItem}
            />
          </div>
        )
      case 'achievements':
        return (
          <AchievementsList 
            achievements={achievements} 
            userAchievements={userAchievements} 
          />
        )
      case 'catalog':
        return (
          <MediaCatalog 
            onAddSuccess={handleRefresh}
            existingItems={items}
          />
        )
      default:
        return (
          <MediaList 
            key={`${activeTab}-${initialFilters.join(',')}`}
            items={items.filter(i => i.type === activeTab)} 
            type={activeTab} 
            onRefresh={handleRefresh}
            initialFilters={initialFilters}
          />
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
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

      <AddMediaDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editItem={editItem}
        onSuccess={handleEditSuccess}
        defaultType={editItem?.type || 'anime'}
      />
    </div>
  )
}
