import * as yup from 'yup'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Notepad } from '@phosphor-icons/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'

import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/app/ModeToggle'

const registerFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(6, 'Mínimo de 6 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas devem ser iguais'),
})

export default function Register() {
  const { register: signUp } = useAuth()

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerFormSchema),
  })

  const handleRegister: SubmitHandler<FieldValues> = async (values) => {
    await signUp(values.name, values.email, values.password)

    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Cadastrar-se | Notepad</title>

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

          <strong className="flex items-center gap-2 my-6 text-xs text-muted-foreground uppercase whitespace-nowrap before:w-full before:h-[1px] before:bg-muted after:w-full after:h-[1px] after:bg-muted">
            preencha os dados abaixo
          </strong>

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="w-full flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <Input
                label="Nome"
                error={errors.name}
                {...register('name')}
                placeholder="John Doe"
              />
              <Input
                type="email"
                label="E-mail"
                error={errors.email}
                {...register('email')}
                placeholder="johndoe@example.com"
              />
              <Input
                label="Senha"
                type="password"
                placeholder="********"
                error={errors.password}
                {...register('password')}
              />
              <Input
                label="Confirmar senha"
                type="password"
                placeholder="********"
                error={errors.confirmPassword}
                {...register('confirmPassword')}
              />
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Entrar
            </Button>
          </form>
        </div>

        <span className="text-sm text-card-foreground">
          Já possui conta?{' '}
          <Link
            href="#"
            className="text-primary transition-all hover:underline"
          >
            Clique aqui
          </Link>
        </span>
      </main>
    </>
  )
}
