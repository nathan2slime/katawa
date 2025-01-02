'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { LoginFormValues, loginSchema } from '~/lib/schemas/login.schema'

import { loginAction } from '~/api/actions/login.action'
import { authState } from '~/store/auth.state'
import { Page } from '~/types'

const Loading = dynamic(async () => (await import('~/components/loading')).Loading, { ssr: false })

const Login: Page = ({ searchParams }) => {
  const router = useRouter()

  const [state, action, pending] = useActionState(loginAction, null)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    searchParams.then(params => {
      const args = z.object({ signout: z.coerce.boolean() }).safeParse(params)

      if (args.success) {
        if (args.data.signout) {
          authState.logged = false
          authState.session = null
        }
      }
    })
  }, [])

  useEffect(() => {
    if (state) {
      if (state.error) {
        toast.error(state.message)
      } else {
        toast.success(state.message)

        router.push('/')
      }
    }
  }, [state])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
          <CardDescription>Faça login para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={action} className="space-y-4">
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
                {pending ? <Loading name="cardio" size="22" speed="2" /> : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
