import { createContext, useContext } from 'react'

const SearchContext = createContext<() => void>(() => {})

export const SearchProvider = SearchContext.Provider

export function useOpenSearch() {
  return useContext(SearchContext)
}
