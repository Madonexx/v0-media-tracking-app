'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navigation } from '@/components/navigation'
import { MediaCatalog } from '@/components/media-catalog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Gamepad2, Sparkles, Trophy, List, Zap, ArrowRight, CheckCircle2, Star, Github } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  const features = [
    {
      title: 'Tracking Completo',
      description: '¿En qué episodio te quedaste? No vuelvas a perder el hilo de tus historias. Lleva el control de animes, series, películas, libros y videojuegos en un solo lugar.',
      icon: List,
      color: 'text-blue-500'
    },
    {
      title: 'Sistema de Logros',
      description: 'Gana medallas y desbloquea logros mientras completas tus series y juegos favoritos. Convierte tu hobby en una aventura épica.',
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      title: 'Búsqueda Inteligente',
      description: 'Conéctate con APIs de MyAnimeList, TMDB y Open Library. Información actualizada de temporadas, capítulos y más al instante.',
      icon: Zap,
      color: 'text-purple-500'
    },
    {
      title: 'Personalización',
      description: 'Elige qué categorías quieres trackear. ¿Solo anime y juegos? Tú decides qué aparece en tu dashboard personal.',
      icon: Sparkles,
      color: 'text-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation 
        activeTab="dashboard" 
        onTabChange={() => router.push('/login')} 
      />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary py-1 px-4 rounded-full bg-primary/5 animate-pulse">
            Beta Abierta - Únete a la comunidad
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Trackea tu contenido, <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Gamifica tu vida.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            ¿Alguna vez olvidaste en qué capítulo de ese anime te quedaste? ¿O si terminaste aquel libro el año pasado? 
            MediaQuest es tu diario digital para no perder nunca el hilo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push('/signup')} className="glow-primary h-12 px-8 text-lg font-bold group">
              Empezar Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('why-track')?.scrollIntoView({ behavior: 'smooth' })} className="h-12 px-8 text-lg">
              Saber más
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current text-yellow-500" />
              <span className="font-bold">4.9/5 Rating</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-bold">100% Gratuito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Track Section */}
      <section id="why-track" className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Deja de preguntarte <br />
                <span className="text-primary">"¿En qué parte iba?"</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A todos nos pasa: empiezas una serie increíble, la dejas por unas semanas y cuando vuelves... ¿era el episodio 12 o el 14? ¿Ya había aparecido ese personaje?
              </p>
              <ul className="space-y-4">
                {[
                  'Trackeo detallado de temporadas y capítulos.',
                  'Progreso porcentual en libros y videojuegos.',
                  'Notas personales para recordar detalles clave.',
                  'Plataformas de streaming: recuerda dónde lo estabas viendo.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl border border-border flex items-center justify-center p-8 overflow-hidden shadow-inner">
                <div className="w-full bg-background rounded-xl border border-border p-4 shadow-2xl space-y-4">
                  <div className="flex items-center gap-3 border-b border-border pb-3">
                    <div className="w-10 h-10 rounded bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse opacity-50" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>Tu Progreso</span>
                      <span className="text-primary">Ep. 14 / 24</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[58%] bg-primary" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-cyan-400 border-cyan-400/30">
                      Saliendo en Crunchyroll
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para tu colección</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Diseñado para los que no solo consumen contenido, sino que lo viven.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 group">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color.replace('text', 'bg')}/10`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try it out Section */}
      <section id="try-it-out" className="py-24 relative overflow-hidden bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Pruébalo en Vivo
              </h2>
              <p className="text-muted-foreground text-lg">
                Busca cualquier cosa y mira cómo funciona nuestro catálogo inteligente.
              </p>
            </div>
            
            <div className="p-6 md:p-10 rounded-3xl border-2 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl">
              <MediaCatalog 
                onAddSuccess={() => router.push('/signup')} 
                existingItems={[]} 
              />
              <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-4 italic">
                  * Esta es una previsualización. Regístrate para guardar contenido en tu biblioteca.
                </p>
                <Button onClick={() => router.push('/signup')} variant="link" className="text-primary font-bold">
                  Crear cuenta ahora para guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Gamepad2 className="w-64 h-64 rotate-12" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">¿Listo para subir de nivel?</h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Únete a cientos de usuarios que ya están trackeando sus historias favoritas con MediaQuest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => router.push('/signup')} className="h-14 px-10 text-lg font-bold">
              Crear mi cuenta gratuita
            </Button>
            <Link href="https://github.com/Madonexx/v0-media-tracking-app" target="_blank">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Github className="mr-2 w-5 h-5" />
                Ver en GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MediaQuest</span>
          </div>
          <p className="text-sm">© 2026 MediaQuest. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-6">
            <Link href="#" className="hover:text-primary transition-colors text-sm">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors text-sm">Términos</Link>
            <Link href="#" className="hover:text-primary transition-colors text-sm">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
