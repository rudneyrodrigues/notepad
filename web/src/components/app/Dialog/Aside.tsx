import Link from 'next/link'
import {
  HamburgerMenuIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons'
import {
  TrashIcon,
  ArchiveIcon,
  BookmarkIcon,
  LightbulbIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetHighlights } from '@/lib/swr/useGetHighlights'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const AsideSheet = (): JSX.Element => {
  const { data, isError, isLoading } = useGetHighlights()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex flex-col overflow-y-auto justify-between"
      >
        <div className="flex flex-col relative overflow-y-auto">
          <Link
            href="/"
            className="flex items-center p-4 rounded gap-4 transition-all hover:bg-muted"
          >
            <LightbulbIcon className="w-6 h-6" />
            Notas
          </Link>

          <strong className="flex items-center text-xs text-muted-foreground my-4 gap-2 uppercase before:w-full before:h-[1px] before:bg-muted-foreground before:rounded after:w-full after:h-[1px] after:bg-muted-foreground after:rounded">
            Marcadores
          </strong>

          <div className="w-full flex flex-col gap-2 px-1 py-4 overflow-y-auto">
            {isLoading &&
              Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-20 min-h-20" />
              ))}

            {isError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <AlertTitle>Erro ao carregar os marcadores</AlertTitle>
                <AlertDescription>Tente novamente mais tarde.</AlertDescription>
              </Alert>
            )}

            {data?.length === 0 ? (
              <Alert>
                <BookmarkIcon className="w-6 h-6" />
                <AlertTitle>Nenhum marcador encontrado</AlertTitle>
                <AlertDescription>
                  Clique no ícone de destaque para adicionar um marcador.
                </AlertDescription>
              </Alert>
            ) : (
              data?.map((highlight) => (
                <Link
                  key={highlight.id}
                  href={`/highlights/${highlight.id}`}
                  className="flex items-center p-4 rounded gap-4 transition-all hover:bg-muted"
                >
                  <BookmarkIcon className="w-6 h-6" />
                  {highlight.content}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <Link
            href="/archive"
            className="flex items-center p-4 rounded gap-4 transition-all hover:bg-muted"
          >
            <ArchiveIcon className="w-6 h-6" />
            Arquivo
          </Link>

          <Link
            href="/trash"
            className="flex items-center p-4 rounded gap-4 transition-all hover:bg-muted"
          >
            <TrashIcon className="w-6 h-6" />
            Lixeira
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

AsideSheet.displayName = 'Aside Sheet'

export { AsideSheet }
