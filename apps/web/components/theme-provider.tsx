'use client'

import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { cn } from '~/lib/utils'
import { appState } from '~/store/app.state'
import { AppChildren } from '~/types'

const removeThemeClasses = () => {
  const themes = ['dark', 'system', 'light']
  const classList = document.body.classList

  for (let index = 0; index < classList.length; index++) {
    const className = `${classList[index]}`

    if (themes.includes(className)) {
      document.body.classList.remove(className)
    }
  }
}

export const ThemeProvider = ({ children }: AppChildren) => {
  const { theme } = useSnapshot(appState)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      removeThemeClasses()
      document.body.classList.add(theme)
    }
  }, [theme])

  return <div className={cn(theme)}>{children}</div>
}
