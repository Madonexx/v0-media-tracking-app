'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MediaItem, 
  MediaType, 
  ContentStatus, 
  UserProgress,
  TYPE_LABELS, 
  CONTENT_STATUS_LABELS,
  USER_PROGRESS_LABELS 
} from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { StarRating } from './star-rating'
import { cn } from '@/lib/utils'

interface AddMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editItem?: MediaItem | null
  prefillData?: Partial<MediaItem> | null
  defaultType?: MediaType
}

export function AddMediaDialog({ open, onOpenChange, onSuccess, editItem, prefillData, defaultType = 'anime' }: AddMediaDialogProps) {
  const [loading, setLoading] = useState(false)
  
  // Get initial values from editItem (editing) or prefillData (from API search) or defaults
  const source = editItem || prefillData
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: source?.title || '',
    type: source?.type || defaultType,
    score: source?.score || null,
    content_status: source?.content_status || 'no_empezado',
    user_progress: source?.user_progress || 'pendiente',
    is_watching: source?.is_watching || false,
    is_up_to_date: source?.is_up_to_date || false,
    dropped_at: source?.dropped_at || '',
    last_episode: source?.last_episode || '',
    current_progress: source?.current_progress || 0,
    total_progress: source?.total_progress || null,
    notes: source?.notes || '',
    image_url: source?.image_url || ''
  })

  // Update form when editItem or prefillData changes
  useEffect(() => {
    const newSource = editItem || prefillData
    if (newSource && open) {
      setFormData({
        title: newSource.title || '',
        type: newSource.type || defaultType,
        score: newSource.score || null,
        content_status: newSource.content_status || 'no_empezado',
        user_progress: newSource.user_progress || 'pendiente',
        is_watching: newSource.is_watching || false,
        is_up_to_date: newSource.is_up_to_date || false,
        dropped_at: newSource.dropped_at || '',
        last_episode: newSource.last_episode || '',
        current_progress: newSource.current_progress || 0,
        total_progress: newSource.total_progress || null,
        notes: newSource.notes || '',
        image_url: newSource.image_url || ''
      })
    }
  }, [editItem, prefillData, defaultType, open])

  // Auto-set is_watching based on user_progress
  useEffect(() => {
    if (formData.user_progress === 'viendo') {
      setFormData(prev => ({ ...prev, is_watching: true }))
    } else if (formData.user_progress === 'completado' || formData.user_progress === 'abandonado') {
      setFormData(prev => ({ ...prev, is_watching: false }))
    }
  }, [formData.user_progress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Debes iniciar sesión para realizar esta acción')
      setLoading(false)
      return
    }

    // Special logic for movies: map "Visto" toggle to user_progress
    let finalProgress = formData.user_progress
    if (formData.type === 'movie') {
      // If movie has a score or notes and progress was completado, keep it
      // This is mostly handled by the UI toggle now
    }

    // Prepare data
    const dataToSave: any = {
      ...formData,
      user_id: user.id,
      status: formData.content_status, // For old schema compatibility
      score: formData.score || null,
      dropped_at: formData.dropped_at || null,
      last_episode: formData.last_episode || null,
      current_progress: Number(formData.current_progress) || 0,
      total_progress: formData.total_progress ? Number(formData.total_progress) : null,
      notes: formData.notes || null,
      image_url: formData.image_url || null,
      updated_at: new Date().toISOString()
    }
    
    let result;
    if (editItem) {
      result = await supabase
        .from('media_items')
        .update(dataToSave)
        .eq('id', editItem.id)
    } else {
      result = await supabase
        .from('media_items')
        .insert(dataToSave)
    }
    
    if (result.error) {
      console.warn('Save failed:', result.error.message)
      
      // Compatibility mode retry
      const compatibilityData = { ...dataToSave }
      delete compatibilityData.content_status
      delete compatibilityData.user_progress
      delete compatibilityData.current_progress
      delete compatibilityData.total_progress
      
      if (editItem) {
        result = await supabase.from('media_items').update(compatibilityData).eq('id', editItem.id)
      } else {
        result = await supabase.from('media_items').insert(compatibilityData)
      }
      
      if (result.error) {
        alert(`Error al guardar: ${result.error.message}`)
        setLoading(false)
        return
      }
    }
    
    setLoading(false)
    onSuccess()
    onOpenChange(false)
    
    // Reset form for next add
    if (!editItem) {
      setFormData({
        title: '',
        type: defaultType,
        score: null,
        content_status: 'no_empezado',
        user_progress: 'pendiente',
        is_watching: false,
        is_up_to_date: false,
        dropped_at: '',
        last_episode: '',
        current_progress: 0,
        total_progress: null,
        notes: '',
        image_url: ''
      })
    }
  }

  const isMovie = formData.type === 'movie'
  const isTypeFixed = !editItem // Hide type selector when adding new (implied by context)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editItem ? 'Editar' : 'Agregar'} {TYPE_LABELS[formData.type as MediaType]}
          </DialogTitle>
          <DialogDescription>
            {editItem 
              ? 'Modifica los datos de tu contenido' 
              : `Ingresa la información de tu nueva ${TYPE_LABELS[formData.type as MediaType].toLowerCase()}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Título
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nombre del contenido"
                required
                className="border-border focus:border-primary h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!isTypeFixed && (
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    Tipo
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as MediaType })}
                  >
                    <SelectTrigger className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className={cn("space-y-2", isTypeFixed && "col-span-2")}>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1">
                  Puntuación
                </Label>
                <StarRating 
                  value={formData.score || null} 
                  onChange={(val) => setFormData({ ...formData, score: val })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Status & Progress (Conditional) */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
            <Label className="text-xs uppercase tracking-wider text-primary font-bold">
              Estado y Progreso
            </Label>
            
            {isMovie ? (
              // MOVIE VIEW: Simple "Watched" toggle
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="movie-watched" className="text-sm font-medium">
                    {formData.user_progress === 'completado' ? 'Ya la vi' : 'Pendiente'}
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Marca si ya terminaste de verla</p>
                </div>
                <Switch
                  id="movie-watched"
                  checked={formData.user_progress === 'completado'}
                  onCheckedChange={(checked) => setFormData({ 
                    ...formData, 
                    user_progress: checked ? 'completado' : 'pendiente' 
                  })}
                />
              </div>
            ) : (
              // ANIME/SERIES/BOOKS/GAMES VIEW: Full tracking
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content_status" className="text-[10px] text-cyan-400 font-bold uppercase">
                      ¿Terminó de emitirse?
                    </Label>
                    <Select
                      value={formData.content_status}
                      onValueChange={(value) => setFormData({ ...formData, content_status: value as ContentStatus })}
                    >
                      <SelectTrigger className="h-8 text-xs border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user_progress" className="text-[10px] text-primary font-bold uppercase">
                      Mi progreso
                    </Label>
                    <Select
                      value={formData.user_progress}
                      onValueChange={(value) => setFormData({ ...formData, user_progress: value as UserProgress })}
                    >
                      <SelectTrigger className="h-8 text-xs border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(USER_PROGRESS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-background/40 p-3 rounded-lg border border-border/40">
                  <div className="space-y-1.5">
                    <Label htmlFor="current_progress" className="text-[10px] font-bold">VISTO / LEÍDO</Label>
                    <Input
                      id="current_progress"
                      type="number"
                      min="0"
                      value={formData.current_progress}
                      onChange={(e) => setFormData({ ...formData, current_progress: parseInt(e.target.value) || 0 })}
                      className="h-8 text-xs border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="total_progress" className="text-[10px] font-bold text-muted-foreground">TOTAL (OPCIONAL)</Label>
                    <Input
                      id="total_progress"
                      type="number"
                      min="0"
                      value={formData.total_progress || ''}
                      onChange={(e) => setFormData({ ...formData, total_progress: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="?"
                      className="h-8 text-xs border-border focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Visuals & Notes */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                URL de imagen
              </Label>
              <Input
                id="image_url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://ejemplo.com/poster.jpg"
                className="border-border focus:border-primary h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Descripción
              </Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Sinopsis, pensamientos o notas personales..."
                className="border-border focus:border-primary resize-none min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="glow-primary px-8">
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              {editItem ? 'Guardar Cambios' : `Agregar ${TYPE_LABELS[formData.type as MediaType]}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
