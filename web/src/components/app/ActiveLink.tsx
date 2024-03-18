import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

interface ActiveLinkProps extends LinkProps {
  className?: string
  children?: ReactNode
  shouldMatchExactHref?: boolean
}

const ActiveLink = ({
  children,
  className,
  shouldMatchExactHref,
  ...rest
}: ActiveLinkProps): JSX.Element => {
  const { asPath } = useRouter()

  let isActive = false

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true
  }

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true
  }

  return (
    <Link
      data-active={isActive}
      className={cn(
        'data-[active=true]:bg-muted data-[active=true]:text-primary data-[active=false]:text-muted-foreground',
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}

ActiveLink.displayName = 'Active Link'

export { ActiveLink }
