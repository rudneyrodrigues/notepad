import useSWR from 'swr'

import { api } from '@/services/apiClient'

type NoteProps = {
  notes: {
    id: string
    title: string
    content: string
    archived: boolean
    trashed: boolean
    createdAt: string
    updatedAt: string
  }[]
}

export const useGetNotesTrash = () => {
  const fetcher = (url: string) =>
    api.get(url).then((res: { data: NoteProps }) => res.data)

  const { data, error, mutate } = useSWR<NoteProps>('/notes/trash', fetcher)

  const dataOrdered = data?.notes.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return {
    data: dataOrdered,
    mutate,
    isLoading: !data && !error,
    isError: error,
  }
}
