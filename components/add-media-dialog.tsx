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
    notes: source?.notes || '',
    image_url: source?.image_url || ''
  })

  // Update form when editItem or prefillData changes
  useEffect(() => {
    const newSource = editItem || prefillData
    if (newSource) {
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
        notes: newSource.notes || '',
        image_url: newSource.image_url || ''
      })
    }
  }, [editItem, prefillData, defaultType])

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

    // Prepare data - we include 'status' for compatibility with old schema
    const dataToSave: any = {
      ...formData,
      user_id: user.id, // Assign ownership
      status: formData.content_status, // For old schema
      score: formData.score || null,
      dropped_at: formData.dropped_at || null,
      last_episode: formData.last_episode || null,
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
    
    // If it fails, it might be because of column mismatch (new columns don't exist yet)
    if (result.error) {
      console.warn('Initial save failed, trying compatibility mode:', result.error.message)
      
      // Compatibility mode: remove columns that might not exist in old schema
      const compatibilityData = { ...dataToSave }
      delete compatibilityData.content_status
      delete compatibilityData.user_progress
      
      if (editItem) {
        result = await supabase
          .from('media_items')
          .update(compatibilityData)
          .eq('id', editItem.id)
      } else {
        result = await supabase
          .from('media_items')
          .insert(compatibilityData)
      }
      
      if (result.error) {
        console.error('Final save attempt failed:', result.error)
        alert(`Error al guardar: ${result.error.message}`)
        setLoading(false)
        return
      }
    }
    
    setLoading(false)
    onSuccess()
    onOpenChange(false)
    
    // Reset form
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
      notes: '',
      image_url: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editItem ? 'Editar' : prefillData ? 'Completar datos de' : 'Agregar'} {TYPE_LABELS[formData.type as MediaType]}
          </DialogTitle>
          <DialogDescription>
            {editItem 
              ? 'Modifica los datos de tu contenido' 
              : prefillData 
                ? 'Completa el estado y progreso de este contenido'
                : 'Agrega nuevo contenido a tu biblioteca'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview when coming from API search */}
          {formData.image_url && (
            <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                <img
                  src={formData.image_url}
                  alt={formData.title || 'Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{formData.title}</p>
                {formData.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{formData.notes}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nombre del contenido"
              required
              className="border-border focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="score">Puntuación (1-10)</Label>
              <Input
                id="score"
                type="number"
                min="1"
                max="10"
                value={formData.score || ''}
                onChange={(e) => setFormData({ ...formData, score: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Opcional"
                className="border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Separated status fields with clear labels */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content_status" className="flex items-center gap-2">
                <span className="text-cyan-400">Estado del contenido</span>
                <span className="text-xs text-muted-foreground">(¿Terminó de emitirse?)</span>
              </Label>
              <Select
                value={formData.content_status}
                onValueChange={(value) => setFormData({ ...formData, content_status: value as ContentStatus })}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user_progress" className="flex items-center gap-2">
                <span className="text-primary">Mi progreso</span>
                <span className="text-xs text-muted-foreground">(¿Lo terminaste de ver?)</span>
              </Label>
              <Select
                value={formData.user_progress}
                onValueChange={(value) => setFormData({ ...formData, user_progress: value as UserProgress })}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_PROGRESS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_episode">Último capítulo/página</Label>
              <Input
                id="last_episode"
                value={formData.last_episode || ''}
                onChange={(e) => setFormData({ ...formData, last_episode: e.target.value })}
                placeholder="Ej: S2E10"
                className="border-border focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dropped_at">
                {formData.user_progress === 'abandonado' ? 'Lo dejé en' : 'Pausado en (opcional)'}
              </Label>
              <Input
                id="dropped_at"
                value={formData.dropped_at || ''}
                onChange={(e) => setFormData({ ...formData, dropped_at: e.target.value })}
                placeholder="Ej: E5"
                className="border-border focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_up_to_date"
                checked={formData.is_up_to_date}
                onCheckedChange={(checked) => setFormData({ ...formData, is_up_to_date: checked })}
              />
              <Label htmlFor="is_up_to_date" className="text-sm">Estoy al día</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">URL de imagen (opcional)</Label>
            <Input
              id="image_url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              className="border-border focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionales..."
              className="border-border focus:border-primary resize-none"
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="glow-primary">
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              {editItem ? 'Guardar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
