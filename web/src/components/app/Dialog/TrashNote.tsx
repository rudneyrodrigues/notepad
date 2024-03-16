import { toast } from 'sonner'
import { ReactNode, useState } from 'react'
import { TrashIcon } from '@radix-ui/react-icons'

import { api } from '@/services/apiClient'
import { Button } from '@/components/ui/button'
import { useGetNotes } from '@/lib/swr/useGetNotes'
import { useGetNotesTrash } from '@/lib/swr/useGetNotesTrash'
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

type Note = {
  id: string
  title: string
  content: string
}

interface TrashNoteProps {
  note: Note
  children: ReactNode
}

const TrashNote = ({ note, children }: TrashNoteProps) => {
  const { mutate: mutateTrash } = useGetNotesTrash()
  const { mutate: mutateNotes } = useGetNotes()

  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRestore = async () => {
    setLoading(true)

    await api.put(`/notes/${note.id}`, { trashed: false }).then(() => {
      toast.success('Nota restaurada com sucesso', {
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })
    })

    setLoading(false)
    setDialogOpen(false)
    mutateTrash()
    mutateNotes()
  }

  const handleDeletePermanently = async () => {
    setLoading(true)

    await api.delete(`/notes/${note.id}`).then(() => {
      toast.success('Nota excluída permanentemente', {
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })
    })

    setLoading(false)
    setDialogOpen(false)
    mutateTrash()
    mutateNotes()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4">
            <span className="flex h-9 items-center px-3 border rounded-md">
              {note.title}
            </span>

            <div
              className="flex flex-col gap-2 p-3 border rounded-md"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>

          <div className="flex flex-col justify-center gap-2 sm:flex-row sm:items-center">
            <Button
              isLoading={loading}
              variant="destructive"
              onClick={handleDeletePermanently}
            >
              <TrashIcon className="w-5 h-5" />
              Excluir permanentemente
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row sm:ml-auto">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                variant="secondary"
                isLoading={loading}
                onClick={handleRestore}
              >
                Restaurar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

TrashNote.displayName = 'TrashNote'

export { TrashNote }
