'use client'

import * as loaders from 'ldrs'

import { createElement } from 'react'

export type Props = {
  name: keyof typeof loaders
  size: string
  speed: string
}

export const Loading = ({ name, ...props }: Props) => {
  const component = loaders[name]
  const tag = 'l'.concat('-').concat(name)

  component.register()

  return createElement(tag, props)
}
