'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, Achievement, UserAchievement, MediaType, Profile, TYPE_LABELS } from '@/lib/types'
import { Dashboard } from '@/components/dashboard'
import { MediaList } from '@/components/media-list'
import { AchievementsList } from '@/components/achievements-list'
import { Spinner } from '@/components/ui/spinner'
import { Gamepad2, Globe, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type TabType = 'dashboard' | 'achievements' | MediaType

export default function SharedProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [items, setItems] = useState<MediaItem[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const fetchSharedData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    // 1. Get profile by slug
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('share_slug', slug)
      .single()
    
    if (profileError || !profileData) {
      setError('Perfil no encontrado')
      setLoading(false)
      return
    }

    if (!profileData.is_public) {
      setError('Este perfil es privado')
      setLoading(false)
      setProfile(profileData)
      return
    }

    setProfile(profileData)

    // 2. Fetch user's public data
    const [itemsRes, achievementsRes, userAchievementsRes] = await Promise.all([
      supabase.from('media_items').select('*').eq('user_id', profileData.id).order('updated_at', { ascending: false }),
      supabase.from('achievements').select('*'),
      supabase.from('user_achievements').select('*').eq('user_id', profileData.id)
    ])
    
    const mappedItems = (itemsRes.data || []).map((item: any) => ({
      ...item,
      content_status: item.content_status || item.status || 'no_empezado',
      user_progress: item.user_progress || (item.is_watching ? 'viendo' : (item.status === 'terminado' ? 'completado' : 'pendiente'))
    }))
    
    setItems(mappedItems)
    setAchievements(achievementsRes.data || [])
    setUserAchievements(userAchievementsRes.data || [])
    setLoading(false)
  }, [supabase, slug])

  useEffect(() => {
    fetchSharedData()
  }, [fetchSharedData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        {error === 'Este perfil es privado' ? <Lock className="w-16 h-16 text-muted-foreground mb-4" /> : <AlertCircle className="w-16 h-16 text-destructive mb-4" />}
        <h1 className="text-2xl font-bold mb-2">{error}</h1>
        <p className="text-muted-foreground mb-6">
          {error === 'Este perfil es privado' 
            ? 'El usuario ha decidido mantener su biblioteca en privado.' 
            : 'No pudimos encontrar la biblioteca que buscas.'}
        </p>
        <Button asChild className="glow-primary">
          <Link href="/">Ir a mi MediaQuest</Link>
        </Button>
      </div>
    )
  }

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Globe },
    ...(profile?.enabled_categories || []).map(cat => ({
      id: cat,
      label: TYPE_LABELS[cat],
      icon: Gamepad2 // Placeholder icon
    })),
    { id: 'achievements' as const, label: 'Logros', icon: Globe }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard items={items} achievements={achievements} userAchievements={userAchievements} />
      case 'achievements':
        return <AchievementsList achievements={achievements} userAchievements={userAchievements} />
      default:
        return <MediaList items={items.filter(i => i.type === activeTab)} type={activeTab} onRefresh={() => {}} readOnly />
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-2">
            <div className="flex items-center gap-2 mr-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Biblioteca de {profile?.username || 'Usuario'}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Globe className="w-2 h-2" /> Perfil Público
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto pb-px flex-1">
              {['dashboard', 'achievements', ...(profile?.enabled_categories || [])].map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(tab as TabType)}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap transition-all',
                    activeTab === tab 
                      ? 'bg-primary/20 text-primary border-b-2 border-primary rounded-b-none' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="capitalize">{tab === 'dashboard' ? 'Dashboard' : tab === 'achievements' ? 'Logros' : TYPE_LABELS[tab as MediaType]}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
