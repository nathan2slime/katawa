'use client'

import { Unauthorized } from '~/components/unauthorized'
import { Page } from '~/types'

const Handle: Page = () => {
  return (
    <div className="w-screen h-screen p-4 flex justify-center items-center">
      <Unauthorized />
    </div>
  )
}

export default Handle
