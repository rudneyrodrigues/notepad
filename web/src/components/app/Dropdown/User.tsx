import { useRouter } from 'next/router'
import { UserIcon, LogOutIcon, WrenchIcon, CircleAlertIcon } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { useGetUser } from '@/lib/swr/useGetUser'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const UserDropdown = () => {
  const { logout } = useAuth()
  const { data, isError, isLoading } = useGetUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()

    router.push('/login')
  }

  if (isLoading) return <Skeleton className="w-9 h-9 rounded-full" />

  if (isError) {
    return (
      <Skeleton className="flex items-center justify-center w-9 h-9 rounded-full">
        <CircleAlertIcon className="w-5 h-5 text-muted-foreground" />
      </Skeleton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={data?.picture} />
          <AvatarFallback>{data?.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between gap-2">
            Perfil
            <UserIcon className="w-5 h-5" />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between gap-2">
            Configurações
            <WrenchIcon className="w-5 h-5" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between gap-2">
            Suporte
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center justify-between gap-2"
        >
          Sair
          <LogOutIcon className="w-5 h-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

UserDropdown.displayName = 'UserDropdown'

export { UserDropdown }
