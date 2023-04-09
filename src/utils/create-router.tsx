import UrlPattern from 'url-pattern'
import { createContext, useContext, useState } from 'react'

type Pages = { [page: string]: string | string[] }

interface Context<Pages> {
  page: keyof Pages | '404'
  params: { [param: string]: string }
  navigate: (pathname: string, options?: { replace: boolean }) => void
}

export function createRouter<P extends Pages>(pages: P) {
  const routes = _parseRoutes(pages)
  const initialMatch = matchRoute(window.location.pathname) as Context<P>
  const RouterContext = createContext<Context<P>>({
    ...initialMatch,
    navigate: () => {},
  })

  function matchRoute(pathname: string) {
    for (const route of routes) {
      const params = route.pattern.match(pathname)
      if (params) return { page: route.page, params }
    }

    return { page: '404', params: {} }
  }

  function RouterProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState(initialMatch.page)
    const [params, setParams] = useState(initialMatch.params)

    function navigate(pathname: string, { replace = false } = {}) {
      const match = matchRoute(pathname)
      setPage(match.page)
      setParams(match.params)
      window.history[replace ? 'replaceState' : 'pushState']({}, '', pathname)
    }

    return (
      <RouterContext.Provider value={{ page, params, navigate }}>
        {children}
      </RouterContext.Provider>
    )
  }

  function useRouter() {
    return useContext(RouterContext)!
  }

  return { RouterProvider, useRouter }
}

function _parseRoutes<P extends Pages>(pages: P) {
  return Object.entries(pages)
    .map(([page, paths]) => {
      const patterns = typeof paths === 'string' ? [paths] : paths
      return patterns.map((path) => ({
        path,
        page,
        pattern: new UrlPattern(path),
      }))
    })
    .flat()
    .sort((a, b) => _score(a.path) - _score(b.path))
}

function _score(pathname: string) {
  return (pathname.match(/(\/|:)/g) || []).length
}
