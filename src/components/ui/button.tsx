import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white hover:from-primary-400 hover:via-secondary-400 hover:to-accent-400 shadow-lg hover:shadow-xl transform hover:scale-105",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:scale-105",
        outline:
          "border-2 border-primary-500/30 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary-50 hover:via-secondary-50 hover:to-accent-50 hover:border-primary-500/60 text-primary-600 hover:text-primary-700",
        secondary:
          "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 hover:from-primary-200 hover:to-secondary-200 shadow-md hover:shadow-lg transform hover:scale-105",
        ghost: "hover:bg-gradient-to-r hover:from-primary-50 hover:via-secondary-50 hover:to-accent-50 text-primary-600 hover:text-primary-700",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700",
        gradient: "bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 hover:from-primary-400 hover:via-secondary-400 hover:to-accent-400 text-white shadow-xl hover:shadow-2xl transform hover:scale-110 hover:rotate-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
