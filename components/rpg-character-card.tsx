'use client'

import { Profile } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Zap, Shield, Sword, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RPGCharacterCardProps {
  profile: Profile
  stats: {
    totalItems: number
    completedItems: number
    achievementsCount: number
    topCategory: string
  }
}

export function RPGCharacterCard({ profile, stats }: RPGCharacterCardProps) {
  const xpForNextLevel = Math.pow(profile.level, 2) * 100
  const xpCurrentLevel = Math.pow(profile.level - 1, 2) * 100
  const progress = ((profile.xp - xpCurrentLevel) / (xpForNextLevel - xpCurrentLevel)) * 100

  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'game': return <Sword className="w-5 h-5 text-red-400" />
      case 'anime': return <Zap className="w-5 h-5 text-yellow-400" />
      case 'book': return <Wand2 className="w-5 h-5 text-purple-400" />
      default: return <Shield className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur-md">
      {/* RPG Header with Rank Background */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-accent/20 -z-10" />
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-primary/50 overflow-hidden shadow-2xl relative">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-4xl">
                  {profile.username?.[0].toUpperCase() || 'M'}
                </div>
              )}
              <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary border-4 border-background flex items-center justify-center font-bold text-lg shadow-lg">
              {profile.level}
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {profile.username || 'Explorador'}
              </h2>
              <Badge variant="secondary" className="font-mono px-3 py-1 bg-primary/10 text-primary border-primary/20">
                Lvl. {profile.level} {profile.title}
              </Badge>
            </div>
            <p className="text-muted-foreground italic text-sm max-w-md">
              "{profile.bio || 'Un misterioso coleccionista de historias ha aparecido.'}"
            </p>
            
            {/* XP Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
                <span>Experiencia (XP)</span>
                <span>{profile.xp} / {xpForNextLevel}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatBox 
            label="Colección" 
            value={stats.totalItems} 
            icon={<Shield className="w-4 h-4 text-blue-400" />} 
            description="Items Totales"
          />
          <StatBox 
            label="Maestría" 
            value={stats.completedItems} 
            icon={<Trophy className="w-4 h-4 text-yellow-400" />} 
            description="Completados"
          />
          <StatBox 
            label="Logros" 
            value={stats.achievementsCount} 
            icon={<Star className="w-4 h-4 text-purple-400" />} 
            description="Desbloqueados"
          />
          <StatBox 
            label="Especialidad" 
            value={stats.topCategory} 
            icon={getIconForCategory(stats.topCategory.toLowerCase())} 
            description="Clase de Media"
          />
        </div>
      </div>

      {/* RPG Decorative Elements */}
      <div className="absolute bottom-0 right-0 p-2 opacity-5 pointer-events-none">
        <Sword className="w-32 h-32 -rotate-12" />
      </div>
    </Card>
  )
}

function StatBox({ label, value, icon, description }: { label: string, value: string | number, icon: React.ReactNode, description: string }) {
  return (
    <div className="bg-muted/20 border border-border p-3 rounded-xl hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-black">{value}</div>
      <div className="text-[9px] text-muted-foreground opacity-70">{description}</div>
    </div>
  )
}
