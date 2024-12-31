import type { NextPage } from 'next'
import type { ReactNode } from 'react'

export type AppChildren<G extends object = object> = Partial<{ children: ReactNode }> & G

type Params<P> = { params: Promise<P & { store: string }> }

export type Page<T extends object = object, P extends object = object> = NextPage<AppChildren<T> & Params<P>>
