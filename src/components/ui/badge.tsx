import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-tag px-3 py-1.5 text-xs font-regular transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:scale-105',
        secondary: 'border-transparent bg-secondary text-white hover:scale-105',
        tag: 'border-transparent bg-secondary text-white hover:scale-105',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:scale-105',
        outline:
          'border border-border text-foreground hover:bg-secondary/30 hover:scale-105',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
