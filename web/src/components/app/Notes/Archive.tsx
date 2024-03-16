import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

import { EditNote } from '../Dialog/EditNote'
import { Skeleton } from '@/components/ui/skeleton'
import { ResizablePanel } from '@/components/ui/resizable'
import { useGetNotesArchive } from '@/lib/swr/useGetNotesArchive'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const NotesArchive = () => {
  const { data, isError, isLoading } = useGetNotesArchive()

  return (
    <ResizablePanel defaultSize={75} maxSize={80} minSize={70}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] p-6 gap-2">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-40" />
          ))}

        {isError && (
          <Alert variant="destructive" className="col-span-full">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <AlertTitle>Erro ao carregar as notas</AlertTitle>
            <AlertDescription>Tente novamente mais tarde.</AlertDescription>
          </Alert>
        )}

        {data?.length === 0 && (
          <Alert className="col-span-full">
            <AlertTitle>Nenhuma nota encontrada</AlertTitle>
            <AlertDescription>
              Clique no botão de adicionar para criar uma nova nota.
            </AlertDescription>
          </Alert>
        )}

        {data?.map((note) => (
          <EditNote key={note.id} note={note}>
            <div className="w-full flex flex-col items-start rounded-md border gap-4 p-4 transition-all cursor-pointer hover:bg-muted hover:border-primary">
              <h2 className="text-base font-bold">
                {note.title.length > 20
                  ? note.title.substring(0, 20) + '...'
                  : note.title}
              </h2>
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html:
                    note.content.length > 100
                      ? note.content.substring(0, 100) + '...'
                      : note.content,
                }}
              />
              <span className="text-xs text-card-foreground mt-auto">
                Última atualização em{' '}
                {new Date(note.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </EditNote>
        ))}
      </div>
    </ResizablePanel>
  )
}

NotesArchive.displayName = 'NotesArchive'

export { NotesArchive }
