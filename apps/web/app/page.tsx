'use client'

import { env } from '@kwa/env'

const Index = () => {
  return <div>{env.NEXT_PUBLIC_API_URL}</div>
}

export default Index
