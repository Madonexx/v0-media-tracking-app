'use client'

import { useState } from 'react'
import { MediaItem, MediaType, UserProgress, TYPE_LABELS, USER_PROGRESS_LABELS } from '@/lib/types'
import { MediaCard } from './media-card'
import { AddMediaDialog } from './add-media-dialog'
import { MediaSearch } from './media-search'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter, Sparkles } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

interface MediaListProps {
  items: MediaItem[]
  type: MediaType
  onRefresh: () => void
}

export function MediaList({ items, type, onRefresh }: MediaListProps) {
  const [search, setSearch] = useState('')
  const [progressFilter, setProgressFilter] = useState<UserProgress | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [prefillData, setPrefillData] = useState<Partial<MediaItem> | null>(null)
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesProgress = progressFilter === 'all' || item.user_progress === progressFilter
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
          <p className="text-muted-foreground">{items.length} items en tu biblioteca</p>
        </div>
        
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
      </div>

      {/* Quick filter chips by progress */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={progressFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setProgressFilter('all')}
          className={progressFilter === 'all' ? 'glow-primary' : ''}
        >
          Todos ({items.length})
        </Button>
        {(Object.entries(USER_PROGRESS_LABELS) as [UserProgress, string][]).map(([value, label]) => {
          const count = progressCounts[value] || 0
          if (count === 0) return null
          return (
            <Button 
              key={value}
              variant={progressFilter === value ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setProgressFilter(value)}
              className={progressFilter === value ? 'glow-primary' : ''}
            >
              {label} ({count})
            </Button>
          )
        })}
      </div>
      
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
        
        <Select value={progressFilter} onValueChange={(v) => setProgressFilter(v as UserProgress | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px] border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Mi progreso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(USER_PROGRESS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay {TYPE_LABELS[type].toLowerCase()} que mostrar</p>
          <div className="flex justify-center gap-2 mt-4">
            {hasApiSearch && (
              <Button onClick={() => setSearchOpen(true)} className="glow-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Buscar con API
              </Button>
            )}
            <Button 
              variant={hasApiSearch ? 'outline' : 'default'}
              onClick={() => setDialogOpen(true)}
              className={!hasApiSearch ? 'glow-primary' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar manualmente
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={setDeleteItem}
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
