import { destroyCookie, parseCookies } from 'nookies'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { AuthTokenError } from '@/services/errors/AuthTokenError'

// create a function that will be around the getServerSideProps and check if the user is authenticated
export function withSSRAuth(fn: GetServerSideProps): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext) => {
    // get the cookies from the request
    const cookies = parseCookies(ctx)

    // check if the user is authenticated
    if (!cookies['@user.token']) {
      // if not, redirect to the login page
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }

    // if the user is authenticated, try to get the props from the page
    try {
      return await fn(ctx)
    } catch (err) {
      // if the error is an instance of AuthTokenError, destroy the cookie and redirect to the login page
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@user.token')

        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        }
      }

      // if the error is not an instance of AuthTokenError, throw the error
      throw err
    }
  }
}
