import * as React from 'react'
import { FieldError } from 'react-hook-form'

import { Label } from './label'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  error?: FieldError
  height?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, name, label, height = 'md', error = null, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col w-full gap-2">
        {!!label && <Label htmlFor={name}>{label}</Label>}

        <input
          id={name}
          name={name}
          type={type}
          data-size={height}
          className={cn(
            'flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50 data-[size=sm]:h-8 data-[size=md]:h-9 data-[size=lg]:h-10',
            className,
          )}
          ref={ref}
          {...props}
        />

        {!!error && (
          <span className="text-xs text-destructive" role="alert">
            {error.message}
          </span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
