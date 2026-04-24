'use client'

import { useState } from 'react'
import { MediaItem, MediaType, MediaStatus, TYPE_LABELS, STATUS_LABELS } from '@/lib/types'
import { MediaCard } from './media-card'
import { AddMediaDialog } from './add-media-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Filter } from 'lucide-react'
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

interface MediaListProps {
  items: MediaItem[]
  type: MediaType
  onRefresh: () => void
}

export function MediaList({ items, type, onRefresh }: MediaListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
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
    if (!open) setEditItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{TYPE_LABELS[type]}</h2>
          <p className="text-muted-foreground">{items.length} items en tu biblioteca</p>
        </div>
        
        <Button onClick={() => setDialogOpen(true)} className="glow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Agregar {TYPE_LABELS[type]}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MediaStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px] border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay {TYPE_LABELS[type].toLowerCase()} que mostrar</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agrega tu primer {TYPE_LABELS[type].toLowerCase().slice(0, -1)}
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={setDeleteItem}
            />
          ))}
        </div>
      )}
      
      <AddMediaDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={onRefresh}
        editItem={editItem}
        defaultType={type}
      />
      
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-card border-2 border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar {deleteItem?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara permanentemente de tu biblioteca.
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
