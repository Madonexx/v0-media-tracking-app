'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, Achievement, UserAchievement, MediaType, Profile, UserProgress, TYPE_LABELS } from '@/lib/types'
import { Navigation } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { MediaList } from '@/components/media-list'
import { MediaCatalog } from '@/components/media-catalog'
import { AchievementsList } from '@/components/achievements-list'
import { SettingsDialog } from '@/components/settings-dialog'
import { AddMediaDialog } from '@/components/add-media-dialog'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

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
  const [error, setError] = useState<string | null>(null)
  
  // Dashboard edit state
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const fetchData = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const [itemsRes, achievementsRes, userAchievementsRes, profileRes] = await Promise.all([
        supabase.from('media_items').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
        supabase.from('achievements').select('*'),
        supabase.from('user_achievements').select('*').eq('user_id', userId),
        supabase.from('profiles').select('*').eq('id', userId).single()
      ])
      
      if (itemsRes.error) {
        console.error('Error fetching items:', itemsRes.error)
        setError(`Error al cargar items: ${itemsRes.error.message}`)
      }
      if (achievementsRes.error) console.error('Error fetching achievements:', achievementsRes.error)
      
      let currentProfile = profileRes.data

      if (profileRes.error) {
        console.warn('Profile fetch error:', profileRes.error.message)
        
        // If profile is missing (PGRST116), try to create it
        if (profileRes.error.code === 'PGRST116') {
          console.log('Profile not found for user, creating one...')
          const { data: authUser } = await supabase.auth.getUser()
          
          const newProfileData = { 
            id: userId, 
            username: authUser.user?.user_metadata?.username || authUser.user?.email?.split('@')[0] || 'Aventurero',
            share_slug: Math.random().toString(36).substring(2, 12)
          }
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfileData])
            .select()
            .single()
          
          if (newProfile) {
            console.log('Profile created successfully')
            currentProfile = newProfile
          } else if (createError) {
            console.error('Failed to create profile:', createError.message)
            setError(`No pudimos crear tu perfil: ${createError.message}`)
          }
        } else {
          setError(`Error al cargar perfil: ${profileRes.error.message}`)
        }
      }

      const mappedItems = (itemsRes.data || []).map((item: any) => ({
        ...item,
        content_status: item.content_status || item.status || 'no_empezado',
        user_progress: item.user_progress || (item.is_watching ? 'viendo' : (item.status === 'terminado' ? 'completado' : 'pendiente'))
      }))
      
      setItems(mappedItems)
      setAchievements(achievementsRes.data || [])
      setUserAchievements(userAchievementsRes.data || [])
      setProfile(currentProfile || null)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Ocurrió un error inesperado al cargar tus datos.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const checkAndUnlockAchievements = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const currentItems = items
      const currentAchievements = achievements
      const currentUnlocked = new Set(userAchievements.map(ua => ua.achievement_id))
      
      let achievementsAdded = false
      
      for (const achievement of currentAchievements) {
        if (!achievement?.id || currentUnlocked.has(achievement.id)) continue
        
        let shouldUnlock = false
        const condition = (achievement.condition_value as Record<string, unknown>) || {}
        
        switch (achievement.condition_type) {
          case 'total_items':
            shouldUnlock = currentItems.length >= (Number(condition.count) || 0)
            break
          case 'completed_by_type':
            const typeFilter = condition.type as string | undefined
            const completedCount = currentItems.filter(i => 
              i.user_progress === 'completado' && 
              (!typeFilter || i.type === typeFilter)
            ).length
            shouldUnlock = completedCount >= (Number(condition.count) || 0)
            break
          case 'perfect_score':
            const perfectCount = currentItems.filter(i => i.score === 10).length
            shouldUnlock = perfectCount >= (Number(condition.count) || 0)
            break
          case 'count_up_to_date':
            shouldUnlock = currentItems.filter(i => i.is_up_to_date).length >= (Number(condition.count) || 0)
            break
          case 'franchise':
            const franchiseName = String(condition.name || '').toLowerCase()
            const franchiseItems = currentItems.filter(i => 
              i.title.toLowerCase().includes(franchiseName) && 
              i.user_progress === 'completado'
            )
            const requiredCount = (Number(condition.count) || 1)
            shouldUnlock = franchiseItems.length >= requiredCount
            break
          case 'genre':
            const genreName = String(condition.name || '').toLowerCase()
            const genreItems = currentItems.filter(i => 
              i.notes?.toLowerCase().includes(genreName) && 
              i.user_progress === 'completado'
            )
            shouldUnlock = genreItems.length >= (Number(condition.count) || 0)
            break
          case 'platinum_count':
            shouldUnlock = currentItems.filter(i => i.is_platinum).length >= (Number(condition.count) || 0)
            break
        }
        
        if (shouldUnlock) {
          await supabase.from('user_achievements').insert({ 
            achievement_id: achievement.id,
            user_id: user.id 
          })
          
          // Award XP for achievement - Using a safer approach
          try {
            await supabase.rpc('add_xp', { user_uuid: user.id, xp_to_add: Number(achievement.points) || 50 })
          } catch (rpcErr) {
            console.warn('RPC add_xp failed (might not be defined yet):', rpcErr)
          }
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
    } catch (err) {
      console.error('Error in achievement checker:', err)
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 bg-card border-2 border-primary/30 rounded-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Inicializando Perfil...</h2>
          <p className="text-muted-foreground mb-6">
            Estamos preparando tu tarjeta de aventurero. Si esto tarda mucho, intenta recargar.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
              {error}
            </div>
          )}
          
          <Button onClick={handleRefresh} className="glow-primary w-full sm:w-auto">
            Reintentar
          </Button>
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
