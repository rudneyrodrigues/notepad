import useSWR from 'swr'

import { api } from '@/services/apiClient'

type UserProps = {
  user: {
    id: string
    name: string
    email: string
    picture?: string
  }
}

export const useGetUser = () => {
  const fetcher = (url: string) =>
    api.get(url).then((res: { data: UserProps }) => res.data)

  const { data, error, mutate } = useSWR<UserProps>('/me', fetcher)

  return {
    data: data?.user,
    mutate,
    isLoading: !data && !error,
    isError: error,
  }
}
