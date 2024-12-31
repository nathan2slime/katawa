import type { Metadata } from 'next'
import { Baloo_2, Titillium_Web } from 'next/font/google'
import { cn } from '~/lib/utils'
import type { AppChildren } from '~/types'

import { Providers } from '~/components/providers'

import '~/app/globals.css'
import { AuthGuard } from '~/components/auth-guard'

export const metadata: Metadata = {}

const baloo = Titillium_Web({
  subsets: ['latin'],
  weight: ['400', '300', '600', '700', '900', ]
})

const RootLayout = ({ children }: Readonly<AppChildren>) => (
  <html lang="en">
    <body className={cn(baloo.className)}>
      <Providers>
        <AuthGuard>{children}</AuthGuard>
      </Providers>
    </body>
  </html>
)

export default RootLayout
