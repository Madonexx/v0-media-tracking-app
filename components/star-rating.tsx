'use client'

import { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number | null
  onChange?: (value: number | null) => void
  readOnly?: boolean
  max?: number
}

export function StarRating({ value, onChange, readOnly = false, max = 10 }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1
          const isFilled = hover !== null ? starValue <= hover : starValue <= (value || 0)
          
          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHover(starValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
              onClick={() => !readOnly && onChange?.(starValue === value ? null : starValue)}
              className={cn(
                "p-0.5 transition-all duration-200",
                !readOnly && "hover:scale-125 cursor-pointer",
                isFilled ? "text-warning" : "text-muted-foreground/30"
              )}
            >
              <Star 
                className={cn(
                  "w-5 h-5", 
                  isFilled && "fill-current drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"
                )} 
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm font-bold w-6 text-center">
          {hover !== null ? hover : value || 0}
        </span>
      </div>
      {!readOnly && value !== null && (
        <button 
          type="button"
          onClick={() => onChange?.(null)}
          className="text-[10px] text-muted-foreground hover:text-foreground underline text-left w-fit"
        >
          Limpiar puntuación
        </button>
      )}
    </div>
  )
}
