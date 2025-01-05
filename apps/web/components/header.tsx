import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'

import { AppChildren } from '~/types'

export const Header = ({ children }: AppChildren) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-30 fixed bg-background/40 backdrop-blur-md w-full border-b border-border">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 flex-shrink-0" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="w-full gap-10 justify-between items-center flex">{children}</div>
      </div>
    </header>
  )
}
