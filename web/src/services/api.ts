import axios from 'axios'
import { parseCookies } from 'nookies'
import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext, PreviewData } from 'next'

export const getAPIClient = (
  ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  const cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${cookies['@user.token']}`,
    },
  })

  return api
}
