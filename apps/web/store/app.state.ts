import { proxy, subscribe } from 'valtio'
import { getStorage, setStorage } from '~/lib/storage'

export type AppState = {
  theme: string
}

export const storageKey = '@kwa/web'

const INITIAL: AppState = {
  theme: 'light'
}

export const appState = proxy(getStorage(storageKey) || INITIAL)

subscribe(appState, () => {
  setStorage(storageKey, appState)
})
