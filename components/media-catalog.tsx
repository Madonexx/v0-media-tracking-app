'use client'

import { useState, useEffect } from 'react'
import { MediaType, TYPE_LABELS, MediaItem } from '@/lib/types'
import { getTrendingMedia, SearchResult } from '@/lib/media-apis'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Plus, Star, Sparkles, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AddMediaDialog } from './add-media-dialog'

interface MediaCatalogProps {
  onAddSuccess: () => void
  existingItems: MediaItem[]
}

export function MediaCatalog({ onAddSuccess, existingItems }: MediaCatalogProps) {
  const [activeType, setActiveType] = useState<MediaType>('anime')
  const [items, setItems] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prefillData, setPrefillData] = useState<Partial<MediaItem> | null>(null)

  const existingTitles = new Set(existingItems.map(i => i.title.toLowerCase()))

  useEffect(() => {
    async function loadTrending() {
      setLoading(true)
      const data = await getTrendingMedia(activeType)
      
      // Filter out items already in the library (by title match)
      const filtered = data.filter(item => 
        !existingTitles.has(item.title.toLowerCase())
      ).slice(0, 12) // Only show 12 items
      
      setItems(filtered)
      setLoading(false)
    }
    loadTrending()
  }, [activeType, existingItems])

  const handleSelectItem = (item: SearchResult) => {
    setPrefillData({
      title: item.title,
      type: activeType,
      image_url: item.image_url,
      content_status: (item.status || 'no_empezado') as any,
      user_progress: 'pendiente',
      score: item.score,
      notes: item.synopsis,
      total_progress: item.episodes || item.chapters || null,
    })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Catálogo de Tendencias
          </h2>
          <p className="text-muted-foreground">Descubre contenido popular y agrégalo con un click</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as MediaType[]).map((type) => (
          <Button
            key={type}
            variant={activeType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveType(type)}
            className={cn("rounded-full px-4", activeType === type && "glow-primary")}
          >
            {TYPE_LABELS[type]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-primary mb-4" />
          <p className="text-muted-foreground">Cargando tendencias...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
          <Sparkles className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
          <p className="text-muted-foreground font-medium">¡Vaya! Ya tienes todo lo popular en tu biblioteca.</p>
          <p className="text-sm text-muted-foreground/60">Vuelve más tarde para ver nuevas tendencias.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card 
              key={item.id} 
              onClick={() => handleSelectItem(item)}
              className="group overflow-hidden border-2 hover:border-primary/40 transition-all flex flex-col h-full cursor-pointer relative"
            >
              <div className="aspect-[2/3] relative bg-muted overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1e293b/white?text=Sin+Imagen'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                    {activeType === 'game' ? '🎮' : activeType === 'book' ? '📚' : '🎬'}
                  </div>
                )}
                {item.score && (
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-warning fill-current" />
                    <span className="text-xs font-bold">{item.score}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-3 scale-75 group-hover:scale-100 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <CardContent className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-auto">{item.year || 'Año desconocido'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddMediaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={onAddSuccess}
        prefillData={prefillData}
        defaultType={activeType}
      />
    </div>
  )
}
