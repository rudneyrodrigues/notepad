import Link from 'next/link'
import { ArchiveIcon, LightbulbIcon, TrashIcon } from 'lucide-react'
import { BookmarkIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'

import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { ResizablePanel } from '../ui/resizable'
import { useGetHighlights } from '@/lib/swr/useGetHighlights'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const Aside = () => {
  const { data, isError, isLoading } = useGetHighlights()

  return (
    <ResizablePanel
      minSize={20}
      maxSize={30}
      defaultSize={25}
      className="hidden lg:flex lg:flex-grow-[23.6] lg:flex-shrink lg:basis-0"
    >
      <aside className="w-full flex flex-col gap-4 border-r h-[calc(100vh-64px)]">
        <div className="flex flex-col relative overflow-y-auto">
          <Link
            href="/"
            className="flex items-center p-4 m-4 rounded gap-4 transition-all hover:bg-muted"
          >
            <LightbulbIcon className="w-6 h-6" />
            Notas
          </Link>

          <strong className="flex items-center text-xs text-muted-foreground my-4 gap-2 uppercase before:w-full before:h-[1px] before:bg-muted-foreground before:rounded after:w-full after:h-[1px] after:bg-muted-foreground after:rounded">
            Marcadores
          </strong>

          <div className="w-full flex flex-col gap-2 p-4 overflow-y-auto">
            <Button size="lg" variant="secondary">
              Adicionar marcador
            </Button>

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

        <div className="flex flex-col gap-2 m-4 mt-auto">
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
      </aside>
    </ResizablePanel>
  )
}

Aside.displayName = 'Aside'

export { Aside }
