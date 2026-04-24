'use client'

import { cn } from '@/lib/utils'
import { MediaType, TYPE_LABELS } from '@/lib/types'
import { Home, Tv, Film, BookOpen, Gamepad2, Clapperboard, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavigationProps {
  activeTab: 'dashboard' | 'achievements' | MediaType
  onTabChange: (tab: 'dashboard' | 'achievements' | MediaType) => void
}

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
  { id: 'anime' as const, label: TYPE_LABELS.anime, icon: Tv },
  { id: 'series' as const, label: TYPE_LABELS.series, icon: Clapperboard },
  { id: 'movie' as const, label: TYPE_LABELS.movie, icon: Film },
  { id: 'book' as const, label: TYPE_LABELS.book, icon: BookOpen },
  { id: 'game' as const, label: TYPE_LABELS.game, icon: Gamepad2 },
  { id: 'achievements' as const, label: 'Logros', icon: Trophy },
]

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-2">
          <div className="flex items-center gap-2 mr-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MediaQuest
            </span>
          </div>
          
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap transition-all',
                  activeTab === item.id 
                    ? 'bg-primary/20 text-primary border-b-2 border-primary rounded-b-none' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
