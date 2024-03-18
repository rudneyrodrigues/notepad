import { toast } from 'sonner'
import { ArchiveIcon, TrashIcon, UpdateIcon } from '@radix-ui/react-icons'
import { FormEvent, ReactNode, useState } from 'react'

import { Editor } from '../Editor'
import { api } from '@/services/apiClient'
import { Input } from '@/components/ui/input'
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
import { useGetNotesArchive } from '@/lib/swr/useGetNotesArchive'

type Note = {
  id: string
  title: string
  content: string
  archived: boolean
  trashed: boolean
}

interface EditNoteProps {
  note: Note
  children: ReactNode
}

const EditNote = ({ note, children }: EditNoteProps) => {
  const { mutate: mutateNotes } = useGetNotes()
  const { mutate: mutateTrash } = useGetNotesTrash()
  const { mutate: mutateArchive } = useGetNotesArchive()

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [content, setContent] = useState<string | undefined>(note.content)

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!title.trim() || !content?.trim()) {
      setLoading(false)

      toast.error('Título e conteúdo são obrigatórios!', {
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })

      return
    }

    await api
      .put(`/notes/${note.id}`, { title, content })
      .then(() => {
        setLoading(false)

        mutateNotes()

        toast.success('Nota atualizada!', {
          action: {
            label: 'Fechar',
            onClick: () => {},
          },
        })
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)

        toast.error('Erro ao atualizar a nota!', {
          action: {
            label: 'Fechar',
            onClick: () => {},
          },
        })
      })

    setDialogOpen(false)
  }

  const handleArchive = async () => {
    setLoading(true)

    await api.put(`/notes/${note.id}`, { archived: true }).then(() => {
      toast.success('Nota arquivada!', {
        description: 'Acesse o arquivo para visualizá-la.',
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })
    })

    setLoading(false)
    setDialogOpen(false)
    mutateNotes()
    mutateArchive()
  }

  const handleUnarchive = async () => {
    setLoading(true)

    await api.put(`/notes/${note.id}`, { archived: false }).then(() => {
      toast.success('Nota desarquivada!', {
        description: 'Acesse a lista de notas para visualizá-la.',
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })
    })

    setLoading(false)
    setDialogOpen(false)
    mutateNotes()
    mutateArchive()
  }

  const handleDelete = async () => {
    setLoading(true)

    await api.put(`/notes/${note.id}`, { trashed: true }).then(() => {
      toast.success('Nota excluída!', {
        description:
          'Você pode restaurá-la na lixeira ou excluí-la permanentemente.',
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      })
    })

    setLoading(false)
    setDialogOpen(false)
    mutateNotes()
    mutateTrash()
    mutateArchive()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>
            {loading ? <UpdateIcon className="animate-spin" /> : title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4">
            <Input
              required
              type="text"
              height="lg"
              name="title"
              value={title}
              placeholder="Título da Nota"
              onChange={(e) => setTitle(e.target.value)}
            />

            <Editor content={content} setContent={setContent} />
          </div>

          <div className="flex flex-col justify-center gap-8 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                isLoading={loading}
                variant="destructive"
                onClick={handleDelete}
              >
                <TrashIcon className="w-5 h-5" />
                Excluir
              </Button>
              <Button
                type="button"
                variant="secondary"
                isLoading={loading}
                onClick={note.archived ? handleUnarchive : handleArchive}
              >
                <ArchiveIcon className="w-5 h-5" />
                {note.archived ? 'Desarquivar' : 'Arquivar'}
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:ml-auto">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant="default"
                isLoading={loading}
                onClick={handleUpdate}
                disabled={title === note.title && content === note.content}
              >
                Atualizar
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

EditNote.displayName = 'EditNote'

export { EditNote }
