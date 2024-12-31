import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

export type QueryFnArgs<T> = {
  api: AxiosInstance
  payload: T
  store?: string
}

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      },
      dehydrate: {
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      }
    }
  })

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
  if (isServer) return makeQueryClient()

  if (!browserQueryClient) browserQueryClient = makeQueryClient()

  return browserQueryClient
}
