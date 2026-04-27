'use client'

import { useState, useEffect } from 'react'
import { MediaItem, MediaType, UserProgress, TYPE_LABELS, USER_PROGRESS_LABELS } from '@/lib/types'
import { MediaCard } from './media-card'
import { AddMediaDialog } from './add-media-dialog'
import { MediaSearch } from './media-search'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Sparkles, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { supportsApiSearch } from '@/lib/media-apis'
import { cn } from '@/lib/utils'

interface MediaListProps {
  items: MediaItem[]
  type: MediaType
  onRefresh: () => void
  readOnly?: boolean
  initialFilters?: UserProgress[]
}

export function MediaList({ items, type, onRefresh, readOnly = false, initialFilters = [] }: MediaListProps) {
  const [search, setSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<UserProgress[]>(initialFilters)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [prefillData, setPrefillData] = useState<Partial<MediaItem> | null>(null)
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null)

  const toggleFilter = (filter: UserProgress) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    )
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesProgress = selectedFilters.length === 0 || selectedFilters.includes(item.user_progress)
    return matchesSearch && matchesProgress
  })

  // Sort items: viendo first, then en_pausa, completado, pendiente, abandonado last
  const sortedItems = [...filteredItems].sort((a, b) => {
    const order: Record<UserProgress, number> = {
      viendo: 0,
      en_pausa: 1,
      completado: 2,
      pendiente: 3,
      abandonado: 4
    }
    return order[a.user_progress] - order[b.user_progress]
  })

  const handleEdit = (item: MediaItem) => {
    setEditItem(item)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    
    const supabase = createClient()
    await supabase.from('media_items').delete().eq('id', deleteItem.id)
    
    setDeleteItem(null)
    onRefresh()
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditItem(null)
      setPrefillData(null)
    }
  }

  const handleSearchSelect = (data: Partial<MediaItem>) => {
    setPrefillData(data)
    setDialogOpen(true)
  }

  const hasApiSearch = supportsApiSearch(type)

  // Count items by progress
  const progressCounts = items.reduce((acc, item) => {
    acc[item.user_progress] = (acc[item.user_progress] || 0) + 1
    return acc
  }, {} as Record<UserProgress, number>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{TYPE_LABELS[type]}</h2>
          <p className="text-muted-foreground">{items.length} {TYPE_LABELS[type].toLowerCase()} en tu biblioteca</p>
        </div>
        
        {!readOnly && (
          <div className="flex gap-2">
            {hasApiSearch && (
              <Button onClick={() => setSearchOpen(true)} className="glow-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Buscar con API
              </Button>
            )}
            <Button 
              onClick={() => setDialogOpen(true)} 
              variant={hasApiSearch ? 'outline' : 'default'}
              className={!hasApiSearch ? 'glow-primary' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              {hasApiSearch ? 'Manual' : `Agregar ${TYPE_LABELS[type]}`}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en tu biblioteca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-border"
            />
          </div>
        </div>

        {/* Multi-select filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> FILTRAR:
          </span>
          <Button 
            variant={selectedFilters.length === 0 ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedFilters([])}
            className={cn("h-7 text-xs rounded-full px-3", selectedFilters.length === 0 && "glow-primary")}
          >
            Todos ({items.length})
          </Button>
          {(Object.entries(USER_PROGRESS_LABELS) as [UserProgress, string][]).map(([value, label]) => {
            const count = progressCounts[value] || 0
            if (count === 0 && !selectedFilters.includes(value)) return null
            const isActive = selectedFilters.includes(value)
            
            return (
              <Button 
                key={value}
                variant={isActive ? 'default' : 'outline'} 
                size="sm"
                onClick={() => toggleFilter(value)}
                className={cn(
                  "h-7 text-xs rounded-full px-3 transition-all",
                  isActive && "glow-primary"
                )}
              >
                {label} ({count})
                {isActive && <X className="ml-1 w-3 h-3" />}
              </Button>
            )
          })}
        </div>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <p>No hay resultados con estos filtros</p>
          {selectedFilters.length > 0 && (
            <Button variant="link" onClick={() => setSelectedFilters([])} className="mt-2">
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={setDeleteItem}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
      
      <MediaSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectItem={handleSearchSelect}
        defaultType={type}
      />
      
      <AddMediaDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={onRefresh}
        editItem={editItem}
        prefillData={prefillData}
        defaultType={type}
      />
      
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-card border-2 border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar {deleteItem?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente de tu biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
