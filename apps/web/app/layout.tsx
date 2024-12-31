import type { Metadata } from 'next'
import { Baloo_2 } from 'next/font/google'
import { cn } from '~/lib/utils'
import type { AppChildren } from '~/types'

import { Providers } from '~/components/providers'

import '~/app/globals.css'

export const metadata: Metadata = {}

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
})

const RootLayout = ({ children }: Readonly<AppChildren>) => (
  <html lang="en">
    <body className={cn(baloo.className)}>
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
