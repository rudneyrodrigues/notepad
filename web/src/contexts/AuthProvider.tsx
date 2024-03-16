import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { destroyCookie, setCookie } from 'nookies'
import { ReactNode, createContext, useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import { api } from '@/services/apiClient'
import { auth } from '@/services/firebase'

interface AuthContextProviderProps {
  children: ReactNode
}

export interface AuthContextDataProps {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  // loginWithGithub: () => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const sevenDayInSecs = 60 * 60 * 24 * 7
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const register = async (name: string, email: string, password: string) => {
    await api
      .post('/register', { name, email, password })
      .then((response) => {
        const { token } = response.data

        setCookie(undefined, '@user.token', token, {
          maxAge: sevenDayInSecs,
          path: '/',
          sameSite: 'strict',
        })

        api.defaults.headers.authorization = `Bearer ${token}`

        toast.error('Sucesso!', {
          description:
            'Cadastro realizado com sucesso! Verifique seu email para ativar sua conta.',
          action: {
            label: 'Fechar',
            onClick: () => {},
          },
        })

        router.push('/login')
      })
      .catch((error) => {
        console.log(error)

        if (error.code === 'ERR_NETWORK') {
          // alert('Erro ao se conectar com o servidor')
          toast.error('Erro!', {
            description:
              'Não foi possível se conectar com o servidor. Tente novamente mais tarde.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }
      })
  }

  const login = async (email: string, password: string) => {
    await api
      .post('/login', { email, password })
      .then((response) => {
        const { token } = response.data

        setCookie(undefined, '@user.token', token, {
          maxAge: sevenDayInSecs,
          path: '/',
          sameSite: 'strict',
        })

        api.defaults.headers.authorization = `Bearer ${token}`

        toast.error('Sucesso!', {
          description: 'Login realizado com sucesso! Bem-vindo de volta',
          action: {
            label: 'Fechar',
            onClick: () => {},
          },
        })

        router.push('/login')
      })
      .catch((error) => {
        console.log(error)

        if (error.code === 'ERR_NETWORK') {
          // alert('Erro ao se conectar com o servidor')
          toast.error('Erro!', {
            description:
              'Não foi possível se conectar com o servidor. Tente novamente mais tarde.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }

        if (error.response.data.message === 'Email or password incorrect') {
          // alert('Email ou senha incorretos')
          toast.error('Erro!', {
            description:
              'Email ou senha incorretos. Verifique os dados e tente novamente.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }

        if (error.response.data.message === 'User is inactive') {
          // alert('Usuário inativo')
          toast.error('Erro!', {
            description:
              'Usuário inativo. Verifique seu email para ativar sua conta.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }

        if (error.response.data.message === 'User already exists') {
          toast.error('Erro!', {
            description: 'Usuário cadastrado através do Google ou Github',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }

        if (error.response.data.message === 'Invalid password') {
          toast.error('Erro!', {
            description:
              'Senha inválida. Verifique os dados e tente novamente.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }

        if (error.request.status === 404) {
          // alert('Usuário não encontrado')
          toast.error('Erro!', {
            description:
              'Usuário não encontrado. Verifique os dados e tente novamente.',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })
        }
      })
  }

  const loginWithGoogle = async () => {
    setLoading(true)

    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider).then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const accessToken = credential?.accessToken

      await api
        .post('/google', { accessToken })
        .then((response) => {
          const { token } = response.data

          setCookie(undefined, '@user.token', token, {
            maxAge: sevenDayInSecs,
            path: '/',
            sameSite: 'strict',
          })

          api.defaults.headers.authorization = `Bearer ${token}`

          toast.error('Sucesso!', {
            description: 'Login realizado com sucesso! Bem-vindo de volta',
            action: {
              label: 'Fechar',
              onClick: () => {},
            },
          })

          router.push('/')
        })
        .catch((error) => {
          console.log(error)

          if (error.code === 'ERR_NETWORK') {
            // alert('Erro ao se conectar com o servidor')
            toast.error('Erro!', {
              description:
                'Não foi possível se conectar com o servidor. Tente novamente mais tarde.',
              action: {
                label: 'Fechar',
                onClick: () => {},
              },
            })
          }

          if (error.response.data.message === 'Invalid user data from Google') {
            // alert('Erro ao se conectar com o servidor')
            toast.error('Dados inválidos', {
              description:
                'Sua conta Google não possui os dados necessários para ser cadastrada. Tente novamente mais tarde',
              action: {
                label: 'Fechar',
                onClick: () => {},
              },
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const logout = () => {
    destroyCookie(null, '@user.token', {
      path: '/',
    })

    toast.error('Sucesso!', {
      description: 'Logout realizado com sucesso! Até a próxima!',
      action: {
        label: 'Fechar',
        onClick: () => {},
      },
    })

    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{ login, register, logout, loading, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  )
}
