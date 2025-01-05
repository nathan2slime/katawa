'use server'

import { Permission } from '@kwa/database'

export const getPermissionsAction = async () => {
  return Object.keys(Permission).map(e => e.toString())
}
