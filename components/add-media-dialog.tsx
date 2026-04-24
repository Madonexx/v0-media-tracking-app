'use client'

import { useState } from 'react'
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
import { MediaItem, MediaType, MediaStatus, TYPE_LABELS, STATUS_LABELS } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'

interface AddMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editItem?: MediaItem | null
  defaultType?: MediaType
}

export function AddMediaDialog({ open, onOpenChange, onSuccess, editItem, defaultType = 'anime' }: AddMediaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: editItem?.title || '',
    type: editItem?.type || defaultType,
    score: editItem?.score || null,
    status: editItem?.status || 'no_empezado',
    is_watching: editItem?.is_watching || false,
    is_up_to_date: editItem?.is_up_to_date || false,
    dropped_at: editItem?.dropped_at || '',
    last_episode: editItem?.last_episode || '',
    notes: editItem?.notes || '',
    image_url: editItem?.image_url || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    
    const dataToSave = {
      ...formData,
      score: formData.score || null,
      dropped_at: formData.dropped_at || null,
      last_episode: formData.last_episode || null,
      notes: formData.notes || null,
      image_url: formData.image_url || null,
      updated_at: new Date().toISOString()
    }
    
    if (editItem) {
      await supabase
        .from('media_items')
        .update(dataToSave)
        .eq('id', editItem.id)
    } else {
      await supabase
        .from('media_items')
        .insert(dataToSave)
    }
    
    setLoading(false)
    onSuccess()
    onOpenChange(false)
    
    // Reset form
    setFormData({
      title: '',
      type: defaultType,
      score: null,
      status: 'no_empezado',
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
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editItem ? 'Editar' : 'Agregar'} {TYPE_LABELS[formData.type as MediaType]}
          </DialogTitle>
          <DialogDescription>
            {editItem ? 'Modifica los datos de tu contenido' : 'Agrega nuevo contenido a tu biblioteca'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
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
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as MediaStatus })}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Puntuacion (1-10)</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="last_episode">Ultimo capitulo/pagina</Label>
              <Input
                id="last_episode"
                value={formData.last_episode || ''}
                onChange={(e) => setFormData({ ...formData, last_episode: e.target.value })}
                placeholder="Ej: S2E10"
                className="border-border focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dropped_at">Dejado en (si aplica)</Label>
            <Input
              id="dropped_at"
              value={formData.dropped_at || ''}
              onChange={(e) => setFormData({ ...formData, dropped_at: e.target.value })}
              placeholder="Ej: E5"
              className="border-border focus:border-primary"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_watching"
                checked={formData.is_watching}
                onCheckedChange={(checked) => setFormData({ ...formData, is_watching: checked })}
              />
              <Label htmlFor="is_watching" className="text-sm">Lo sigo viendo</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="is_up_to_date"
                checked={formData.is_up_to_date}
                onCheckedChange={(checked) => setFormData({ ...formData, is_up_to_date: checked })}
              />
              <Label htmlFor="is_up_to_date" className="text-sm">Estoy al dia</Label>
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
