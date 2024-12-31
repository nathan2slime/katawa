import { env } from '@kwa/env'

export type AppConfig = typeof env

export default () => env
