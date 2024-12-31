import { env } from '@kwa/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const middleware = async (req: NextRequest) => {
  const headers = new Headers(req.headers)
  const url = req.nextUrl

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    img-src 'self' blob: data:;
    font-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

  headers.set('x-pathname', url.pathname)
  headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
  headers.set('x-nonce', nonce)

  return NextResponse.next({ headers })
}

export const config = {
  matcher: [
    {
      source: '/((?!api/|_next/static|_next/image|favicon.ico|[\\w-]+\\.\\w+).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
}

export default middleware
