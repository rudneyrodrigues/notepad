import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

import { Skeleton } from '../../ui/skeleton'
import { ResizablePanel } from '../../ui/resizable'
import { useGetNotesTrash } from '@/lib/swr/useGetNotesTrash'
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert'
import { TrashNote } from '../Dialog/TrashNote'

const NotesTrash = () => {
  const { data, isError, isLoading } = useGetNotesTrash()

  return (
    <ResizablePanel defaultSize={75} maxSize={80} minSize={70}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] p-6 gap-2">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-40 bg-destructive/10" />
          ))}

        {isError && (
          <Alert variant="destructive" className="col-span-full">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <AlertTitle>Erro ao carregar lixeira</AlertTitle>
            <AlertDescription>Tente novamente mais tarde.</AlertDescription>
          </Alert>
        )}

        {data?.length === 0 && (
          <Alert className="col-span-full">
            <AlertTitle>Lixeira vazia</AlertTitle>
            <AlertDescription>
              Nenhum item encontrado na lixeira.
            </AlertDescription>
          </Alert>
        )}

        {data?.map((note) => (
          <TrashNote key={note.id} note={note}>
            <div className="w-full flex flex-col items-start rounded-md border gap-4 p-4 transition-all cursor-pointer hover:bg-muted hover:border-destructive hover:text-destructive">
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
          </TrashNote>
        ))}
      </div>
    </ResizablePanel>
  )
}

NotesTrash.displayName = 'NotesTrash'

export { NotesTrash }
