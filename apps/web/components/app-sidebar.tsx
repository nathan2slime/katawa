'use client'

import { Bot, SquareTerminal } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '~/components/nav-main'
import { NavUser } from '~/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar'
import { useAuth } from '~/hooks/use-auth'
import { useMenu } from '~/hooks/use-menu'

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { session } = useAuth()

  const data = useMenu(session.user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
