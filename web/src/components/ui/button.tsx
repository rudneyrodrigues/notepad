import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { UpdateIcon } from '@radix-ui/react-icons'

const ButtonVariants = cva(
  'flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 min-h-9 px-4',
        sm: 'h-8 min-h-8 rounded-md px-3 text-xs',
        lg: 'h-10 min-h-10 rounded-md px-8',
        icon: 'h-9 w-9 min-h-9 min-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={isLoading}
        className={cn(ButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? <UpdateIcon className="animate-spin" /> : props.children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, ButtonVariants }
