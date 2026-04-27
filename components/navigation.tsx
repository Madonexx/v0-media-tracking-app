'use client'

import { cn } from '@/lib/utils'
import { MediaType, TYPE_LABELS } from '@/lib/types'
import { Home, Tv, Film, BookOpen, Gamepad2, Clapperboard, Trophy, Settings, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavigationProps {
  activeTab: 'dashboard' | 'achievements' | MediaType
  onTabChange: (tab: 'dashboard' | 'achievements' | MediaType) => void
  enabledCategories?: MediaType[]
  onOpenSettings?: () => void
}

export function Navigation({ activeTab, onTabChange, enabledCategories, onOpenSettings }: NavigationProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const allNavItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home, type: 'core' },
    { id: 'anime' as const, label: TYPE_LABELS.anime, icon: Tv, type: 'media' },
    { id: 'series' as const, label: TYPE_LABELS.series, icon: Clapperboard, type: 'media' },
    { id: 'movie' as const, label: TYPE_LABELS.movie, icon: Film, type: 'media' },
    { id: 'book' as const, label: TYPE_LABELS.book, icon: BookOpen, type: 'media' },
    { id: 'game' as const, label: TYPE_LABELS.game, icon: Gamepad2, type: 'media' },
    { id: 'achievements' as const, label: 'Logros', icon: Trophy, type: 'core' },
  ]

  const navItems = allNavItems.filter(item => {
    if (item.type === 'core') return true
    if (!enabledCategories) return true
    return enabledCategories.includes(item.id as MediaType)
  })

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
          
          <div className="flex items-center gap-1 overflow-x-auto pb-px flex-1">
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

          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ajustes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
