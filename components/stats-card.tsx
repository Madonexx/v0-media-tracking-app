'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color?: 'primary' | 'accent' | 'success' | 'warning'
  subtitle?: string
}

export function StatsCard({ title, value, icon, color = 'primary', subtitle }: StatsCardProps) {
  const colorClasses = {
    primary: 'glow-primary border-primary/30',
    accent: 'glow-accent border-accent/30',
    success: 'glow-success border-success/30',
    warning: 'border-warning/30'
  }

  const iconColorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning'
  }

  return (
    <Card className={cn('border-2 transition-all hover:scale-105', colorClasses[color])}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-lg bg-secondary', iconColorClasses[color])}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
