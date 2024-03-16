import useSWR from 'swr'

import { api } from '@/services/apiClient'

type HighlightsProps = {
  highlights: {
    id: string
    content: string
  }[]
}

export const useGetHighlights = () => {
  const fetcher = (url: string) =>
    api.get(url).then((res: { data: HighlightsProps }) => res.data)

  const { data, error, mutate } = useSWR<HighlightsProps>(
    '/notes/highlights',
    fetcher,
  )

  return {
    data: data?.highlights,
    mutate,
    isLoading: !data && !error,
    isError: error,
  }
}
