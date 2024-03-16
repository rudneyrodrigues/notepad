import * as React from 'react'
import { FieldError } from 'react-hook-form'

import { Label } from './label'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  error?: FieldError
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, name, error = null, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-2">
        {!!label && <Label htmlFor={name}>{label}</Label>}

        <textarea
          id={name}
          name={name}
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground outline-none focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
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
Textarea.displayName = 'Textarea'

export { Textarea }
