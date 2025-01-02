'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'

export const Unauthorized = () => {
  return (
    <div className="w-full gap-4 max-w-sm flex flex-col items-center justify-center">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription className="italic">Unable to access. Check if you have authorization</AlertDescription>
      </Alert>

      <Link href="/">
        <Button variant="outline">Go to Home</Button>
      </Link>
    </div>
  )
}
