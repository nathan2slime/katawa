'use client'

import { Bot, SquareTerminal } from 'lucide-react'
import * as React from 'react'

import { User } from '@kwa/database'
import { useSnapshot } from 'valtio'
import { NavMain } from '~/components/nav-main'
import { NavUser } from '~/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '~/components/ui/sidebar'
import { authState } from '~/store/auth.state'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Loja',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Products',
          url: '#'
        },
        {
          title: 'Sales',
          url: '#'
        }
      ]
    },
    {
      title: 'Manager',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Users',
          url: '#'
        },
        {
          title: 'Roles',
          url: '#'
        }
      ]
    }
  ]
}

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { session } = useSnapshot(authState)

  const user = session?.user as User

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
