import { AppChildren } from '~/types'

const AppLayout = ({ children }: AppChildren) => {
  return <div className="w-screen h-screen bg-background">{children}</div>
}

export default AppLayout
