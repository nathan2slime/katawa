import type { Metadata } from 'next'
import { Comic_Neue } from 'next/font/google'
import { cn } from '~/lib/utils'
import type { AppChildren } from '~/types'

import { AuthGuard } from '~/components/auth-guard'
import { Providers } from '~/components/providers'

import '~/app/globals.css'

export const metadata: Metadata = {}

const baloo = Comic_Neue({
  subsets: ['latin'],
  weight: ['400', '300', '700']
})

const RootLayout = ({ children }: Readonly<AppChildren>) => (
  <html lang="en">
    <body className={cn(baloo.className, 'overflow-hidden')}>
      <Providers>
        <AuthGuard>{children}</AuthGuard>
      </Providers>
    </body>
  </html>
)

export default RootLayout
