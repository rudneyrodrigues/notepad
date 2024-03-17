import * as yup from 'yup'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import { Notepad, GoogleLogo, GithubLogo } from '@phosphor-icons/react'

import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/app/ModeToggle'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

const loginFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
})

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const { login, loading, loginWithGoogle, loginWithGithub } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  })

  const handleLogin: SubmitHandler<FieldValues> = async (values) => {
    await login(values.email, values.password)

    router.push('/')
  }

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle()

    router.push('/')
  }

  const handleLoginWithGithub = async () => {
    await loginWithGithub()

    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Entrar | Notepad</title>

        <meta name="title" content="Título da página" />
        <meta name="description" content="Descrição da página" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">
        <div className="flex flex-col gap-2 bg-background border rounded p-4 md:p-8 w-full max-w-[500px]">
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-between">
              <Button size="icon" variant="ghost">
                <Notepad size={24} />
              </Button>

              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                Notepad
              </h1>

              <ModeToggle />
            </div>

            <span className="text-sm text-muted-foreground">
              Anotações rápidas e simples para você não esquecer de nada.
            </span>
          </header>

          <div className="w-full mt-8 flex items-center gap-2">
            <Button
              variant="outline"
              isLoading={loading}
              onClick={handleLoginWithGoogle}
              className="w-full"
            >
              <GoogleLogo size={20} />
              Google
            </Button>
            <Button
              variant="outline"
              isLoading={loading}
              onClick={handleLoginWithGithub}
              className="w-full"
            >
              <GithubLogo size={20} />
              Github
            </Button>
          </div>

          <strong className="flex items-center gap-2 my-6 text-xs text-muted-foreground uppercase whitespace-nowrap before:w-full before:h-[1px] before:bg-muted after:w-full after:h-[1px] after:bg-muted">
            Ou entre com
          </strong>

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="w-full flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                label="E-mail"
                error={errors.email}
                {...register('email')}
                placeholder="johndoe@example.com"
              />
              <div className="flex flex-col gap-1 items-start">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  error={errors.password}
                  {...register('password')}
                />

                <div className="flex w-full items-center justify-between mt-2 gap-2">
                  <Link
                    href="#"
                    className="text-sm text-primary transition-all hover:underline"
                  >
                    Esqueci minha senha
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="block text-sm text-muted-foreground">
                      Mostrar senha
                    </span>
                    <Switch
                      checked={showPassword}
                      onCheckedChange={setShowPassword}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Entrar
            </Button>
          </form>
        </div>

        <span className="text-sm text-card-foreground">
          Não possui conta?{' '}
          <Link
            href="/register"
            className="text-primary transition-all hover:underline"
          >
            Cadastrar-se
          </Link>
        </span>
      </main>
    </>
  )
}
