'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Star, Calendar, Info, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { searchMedia, supportsApiSearch, getApiSearchMessage, type SearchResult } from '@/lib/media-apis'
import { MediaType, TYPE_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MediaSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectItem: (item: Partial<import('@/lib/types').MediaItem>) => void
  defaultType?: MediaType
}

export function MediaSearch({ open, onOpenChange, onSelectItem, defaultType = 'anime' }: MediaSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<MediaType>(defaultType)

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const searchResults = await searchMedia(query, selectedType)
      setResults(searchResults)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [query, selectedType])

  // Reset when type changes
  useEffect(() => {
    setQuery('')
    setResults([])
  }, [selectedType])

  // Reset when dialog opens with new type
  useEffect(() => {
    if (open) {
      setSelectedType(defaultType)
      setQuery('')
      setResults([])
    }
  }, [open, defaultType])

  const handleSelectItem = (result: SearchResult) => {
    // Build notes from API metadata
    const noteParts: string[] = []
    if (result.genres.length > 0) noteParts.push(result.genres.join(', '))
    if (result.author) noteParts.push(result.author)
    if (result.synopsis) noteParts.push(result.synopsis.slice(0, 200) + (result.synopsis.length > 200 ? '...' : ''))
    
    // Map API status to our content_status
    // API returns: airing, finished, upcoming, unknown
    let contentStatus: 'terminado' | 'saliendo' | 'en_espera' | 'no_empezado' = 'no_empezado'
    if (result.status === 'finished') contentStatus = 'terminado'
    else if (result.status === 'airing') contentStatus = 'saliendo'
    else if (result.status === 'upcoming') contentStatus = 'en_espera'
    
    // Pass to parent to open edit dialog with pre-filled data
    onSelectItem({
      title: result.title,
      type: selectedType,
      score: result.score || null,
      content_status: contentStatus,
      user_progress: 'pendiente',
      is_watching: false,
      is_up_to_date: false,
      image_url: result.image_url || '',
      notes: noteParts.join('\n\n') || '',
      last_episode: result.episodes ? `${result.episodes} eps totales` : result.chapters ? `${result.chapters} páginas` : ''
    })
    
    // Close search dialog
    onOpenChange(false)
  }

  const hasApiSupport = supportsApiSearch(selectedType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscar y agregar contenido
          </DialogTitle>
          <DialogDescription>
            {getApiSearchMessage(selectedType)}
          </DialogDescription>
        </DialogHeader>

        {/* Type selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(TYPE_LABELS) as [MediaType, string][]).map(([type, label]) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
              className={cn(
                selectedType === type && 'glow-primary',
                !supportsApiSearch(type) && 'opacity-70'
              )}
            >
              {label}
              {!supportsApiSearch(type) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sin API - agregar manual</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={hasApiSupport ? `Buscar ${TYPE_LABELS[selectedType].toLowerCase()}...` : 'Escribe para agregar manualmente...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 border-border focus:border-primary"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
          )}
        </div>

        {/* Results */}
        {hasApiSupport ? (
          <ScrollArea className="h-[400px] pr-4">
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex gap-3 p-3 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-colors"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-16 h-24 rounded-md overflow-hidden bg-muted">
                      {result.image_url ? (
                        <img
                          src={result.image_url}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{result.title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {result.year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {result.year}
                          </span>
                        )}
                        {result.score && (
                          <span className="flex items-center gap-1 text-warning">
                            <Star className="h-3 w-3 fill-current" />
                            {result.score}/10
                          </span>
                        )}
                        {result.episodes && (
                          <span>{result.episodes} eps</span>
                        )}
                        {result.author && (
                          <span className="truncate">{result.author}</span>
                        )}
                      </div>

                      {result.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {result.synopsis && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {result.synopsis}
                        </p>
                      )}
                    </div>

                    {/* Select button */}
                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleSelectItem(result)}
                        className="glow-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="h-12 w-12 mb-2 opacity-50" />
                <p>No se encontraron resultados</p>
                <p className="text-sm">Intenta con otro termino de busqueda</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="h-12 w-12 mb-2 opacity-50" />
                <p>Escribe al menos 2 caracteres</p>
                <p className="text-sm">para buscar {TYPE_LABELS[selectedType].toLowerCase()}</p>
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Info className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-center mb-2">
              La busqueda automatica para {TYPE_LABELS[selectedType].toLowerCase()} requiere una API key.
            </p>
            <p className="text-sm text-center mb-4">
              Usa el boton de abajo para agregar manualmente.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                // Trigger manual add - this will be handled by parent component
              }}
            >
              Agregar manualmente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
