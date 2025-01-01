export const setStorage = <T = object>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(key, JSON.stringify(value))

    return true
  } catch (_error) {
    console.log(_error)

    return false
  }
}

export const getStorage = <T = object>(key: string): T | null => {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(localStorage.getItem(key) || '') as T
  } catch (_error) {
    console.log(_error)

    return null
  }
}
