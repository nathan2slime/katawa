'use client'

import { Moon, Sun } from 'lucide-react'

import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '~/components/ui/dropdown-menu'
import { appState } from '~/store/app.state'

export const ThemeToggle = () => {
  const setTheme = (theme: string) => {
    appState.theme = theme
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        Toggle theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
