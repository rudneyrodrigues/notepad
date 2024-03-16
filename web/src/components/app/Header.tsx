import Link from 'next/link'
import { Notepad } from '@phosphor-icons/react'
import { UpdateIcon } from '@radix-ui/react-icons'

import { Button } from '../ui/button'
import { ModeToggle } from './ModeToggle'
import { NewNote } from './Dialog/NewNote'
import { UserDropdown } from './Dropdown/User'
import { useGetNotes } from '@/lib/swr/useGetNotes'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

const Header = () => {
  const { mutate, isLoading } = useGetNotes()

  return (
    <header className="h-16 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-16 w-full max-w-screen-xl mx-auto px-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Notepad
            size={32}
            weight="fill"
            className="text-primary fill-primary"
          />
          <Link href="/" className="text-lg font-bold">
            Notepad
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                isLoading={isLoading}
                onClick={() => mutate()}
              >
                <UpdateIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Atualizar</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            <NewNote />
            <ModeToggle />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  )
}

Header.displayName = 'Header'

export { Header }
