import type { Metadata } from 'next'
import { Titillium_Web } from 'next/font/google'
import { cn } from '~/lib/utils'
import type { AppChildren } from '~/types'

import { AuthGuard } from '~/components/auth-guard'
import { Providers } from '~/components/providers'

import '~/app/globals.css'

export const metadata: Metadata = {}

const baloo = Titillium_Web({
  subsets: ['latin'],
  weight: ['400', '300', '600', '700', '900']
})

const RootLayout = ({ children }: Readonly<AppChildren>) => (
  <html lang="en">
    <body className={cn(baloo.className, 'overflow-hidden dark')}>
      <Providers>
        <AuthGuard>{children}</AuthGuard>
      </Providers>
    </body>
  </html>
)

export default RootLayout
