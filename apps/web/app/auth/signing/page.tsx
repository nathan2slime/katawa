'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

import { LoginFormValues, loginSchema } from '~/lib/schemas/login'

import { Page } from '~/types'
import { loginMutation } from '~/api/mutations/login.mutation'
import { api } from '~/api/client'
import dynamic from 'next/dynamic'
import { authState } from '~/store/auth.state'

const Loading = dynamic(async () => (await import('~/components/loading')).Loading, { ssr: false })

const Login: Page = () => {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginFormValues) => loginMutation({ api, payload })
  })

  const onSubmit = async (data: LoginFormValues) => {
    const session = await mutation.mutateAsync(data)

    if (session) {
      authState.logged = true
      authState.session = session

      router.push('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
          <CardDescription>Faça login para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full uppercase font-medium">
                {mutation.status === 'pending' ? <Loading name="cardio" size="40" speed="2" /> : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
