import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { Editor } from '../Editor'
import { api } from '@/services/apiClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useGetNotes } from '@/lib/swr/useGetNotes'

const NewNote = () => {
  const { mutate } = useGetNotes()

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [content, setContent] = useState<string | undefined>('')

  const handleSave = async (e: FormEvent) => {
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
      .post('/notes', { title, content })
      .then(() => {
        setLoading(false)

        mutate()

        toast.success('Nota criada com sucesso!', {
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

    setTitle('')
    setContent('')
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <PlusIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Adicionar uma nova nota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-8 p-6">
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
              onClick={handleSave}
              disabled={!title.trim()}
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

NewNote.displayName = 'NewNote'

export { NewNote }
