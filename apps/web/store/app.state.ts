import { proxy, subscribe } from 'valtio'
import { setStorage } from '~/lib/storage'

export type AppState = {
  theme: string
}

export const storageKey = '@kwa/web'

const INITIAL: AppState = {
  theme: 'light'
}

export const appState = proxy(INITIAL)

subscribe(appState, () => {
  setStorage(storageKey, appState)
})
