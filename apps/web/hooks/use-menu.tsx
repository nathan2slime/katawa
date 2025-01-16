import { User } from '@kwa/database'
import { Bot, SquareTerminal } from 'lucide-react'
import { useCallback } from 'react'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Loja',
      url: '/',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Products',
          url: '/products'
        },
        {
          title: 'Sales',
          url: '/sales'
        }
      ]
    }
  ]
}

const manager = {
  title: 'Manager',
  url: '#',
  icon: Bot,
  isActive: true,
  items: [
    {
      title: 'Users',
      url: '/manager/users'
    },
    {
      title: 'Categories',
      url: '/manager/categories'
    },
    {
      title: 'Roles',
      url: '/manager/roles'
    }
  ]
}

export const useMenu = (user: User) => {
  return useCallback(() => {
    const navMain = user.owner ? [...data.navMain, manager] : data.navMain

    return { ...data, navMain }
  }, [user.owner])()
}
