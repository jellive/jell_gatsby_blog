import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-lg px-6 py-3 hover:bg-primary/90 shadow-sm",
        secondary:
          "bg-transparent border border-border text-foreground rounded-lg px-6 py-3 hover:bg-accent/50",
        outline:
          "bg-transparent border border-border text-foreground rounded-lg px-6 py-3 hover:bg-accent/50",
        destructive:
          "bg-destructive text-destructive-foreground rounded-lg px-6 py-3 hover:bg-destructive/90 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2",
        link: "text-primary underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-button px-6 py-3 text-base font-medium", // 44px height
        sm: "h-8 px-4 py-2 text-sm font-medium",
        lg: "h-12 px-8 py-4 text-lg font-medium",
        icon: "h-button w-button rounded-lg", // 44x44px square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }