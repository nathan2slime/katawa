'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { getQueryClient } from '~/api/query'
import { ThemeProvider } from '~/components/theme-provider'
import { AppChildren } from '~/types'

export const Providers = ({ children }: AppChildren) => {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />

        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
