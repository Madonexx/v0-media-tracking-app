'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, MediaType, TYPE_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Copy, Check, Globe, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
  onUpdate: () => void
}

export function SettingsDialog({ open, onOpenChange, profile, onUpdate }: SettingsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [enabledCategories, setEnabledCategories] = useState<MediaType[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()

  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setEnabledCategories(profile.enabled_categories || [])
      setIsPublic(profile.is_public || false)
      setBio(profile.bio || '')
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile, open])

  const handleSave = async () => {
    if (!profile) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        enabled_categories: enabledCategories,
        is_public: isPublic,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)

    setLoading(false)
    if (error) {
      toast.error(`Error al guardar: ${error.message}`)
    } else {
      toast.success('Perfil actualizado correctamente')
      onUpdate()
      onOpenChange(false)
    }
  }

  const regenerateSlug = async () => {
    if (!profile) return
    const newSlug = Math.random().toString(36).substring(2, 10)
    
    const { error } = await supabase
      .from('profiles')
      .update({ share_slug: newSlug })
      .eq('id', profile.id)
    
    if (error) {
      toast.error('Error al generar nuevo enlace')
    } else {
      toast.success('Nuevo enlace generado')
      onUpdate()
    }
  }

  const toggleCategory = (category: MediaType) => {
    setEnabledCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const copyShareLink = () => {
    if (!profile?.share_slug) return
    const url = `${window.location.origin}/share/${profile.share_slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle>Ajustes de Perfil</DialogTitle>
          <DialogDescription>
            Personaliza tu experiencia y visibilidad
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu apodo"
                className="border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">URL del Avatar (Imagen RPG)</Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía / Frase de Personaje</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ej: Explorador de mundos digitales y coleccionista de historias."
                className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Categorías a Trackear</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(TYPE_LABELS) as [MediaType, string][]).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2 border border-border p-2 rounded-lg bg-muted/30">
                  <Checkbox 
                    id={`cat-${value}`} 
                    checked={enabledCategories.includes(value)}
                    onCheckedChange={() => toggleCategory(value)}
                  />
                  <label 
                    htmlFor={`cat-${value}`}
                    className="text-xs font-medium leading-none cursor-pointer select-none flex-1"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  {isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  Perfil Público
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Permite que otros vean tu "Tarjeta de Personaje"
                </p>
              </div>
              <Switch 
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {isPublic && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted p-2 rounded text-[10px] truncate border border-border font-mono">
                    {window.location.origin}/share/{profile?.share_slug || '...'}
                  </div>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={copyShareLink} title="Copiar enlace">
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={regenerateSlug} title="Regenerar enlace">
                    <Loader2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[9px] text-muted-foreground italic">
                  * Si regeneras el enlace, el anterior dejará de funcionar.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading} className="glow-primary">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
