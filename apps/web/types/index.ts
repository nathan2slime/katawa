import type { NextPage } from 'next'
import type { ReactNode } from 'react'

export type AppChildren<G extends object = object> = Partial<{ children: ReactNode }> & G

type Params<P> = { params: Promise<P> }
type SearchParams<S> = {
  searchParams: Promise<S | undefined>
}

export type Page<T extends object = object, P extends object = object, S extends object = Record<string, string>> = NextPage<AppChildren<T> & Params<P> & SearchParams<S>>
