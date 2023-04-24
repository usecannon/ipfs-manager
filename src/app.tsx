import qs from 'qs'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect } from 'react'

import { FORMAT, Format, Page, StoreProvider, useStore } from './store'
import { History } from './pages/History'
import { Menu } from './components/Menu'
import { RouterProvider, useRouter } from './routes'
import { Upload } from './pages/Upload'
import { View } from './pages/View'
import { theme } from './theme'

function BaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider>{children}</RouterProvider>
    </ChakraProvider>
  )
}

export function App() {
  const { page, params, query } = useRouter()

  return (
    <BaseProvider>
      <StoreProvider
        initialState={{
          page: page as Page,
          compression: query.compression ? true : false,
          format: FORMAT.includes(query.format as Format)
            ? (query.format as Format)
            : 'text',
          ...params,
        }}
      >
        <Content />
      </StoreProvider>
    </BaseProvider>
  )
}

function Content() {
  const state = useStore()
  const router = useRouter()

  function _getQuery() {
    if (!['view', 'upload'].includes(state.page)) return ''
    const query: { compression?: 'true'; format?: Format } = {}
    if (state.compression) query.compression = 'true'
    if (state.format !== 'text') query.format = state.format
    if (Object.keys(query).length === 0) return ''
    return `?${qs.stringify(query)}`
  }

  useEffect(() => {
    if (state.page === 'view') {
      const replace = state.page === router.page
      router.navigate(`/${state.cid}${_getQuery()}`, { replace })
    } else if (state.page === 'upload') {
      router.navigate(`/${state.page}${_getQuery()}`)
    } else {
      router.navigate(`/${state.page}`)
    }
  }, [state.page])

  useEffect(() => {
    router.navigate(`${window.location.pathname}${_getQuery()}`, {
      replace: true,
    })
  }, [state.compression, state.format])

  useEffect(() => {
    if (state.page === 'view') {
      router.navigate(`/${state.cid}${_getQuery()}`, { replace: true })
    }
  }, [state.cid])

  if (state.page === '404') return <p>Page Not Found</p>

  return (
    <>
      <Menu />
      {state.page === 'view' && <View />}
      {state.page === 'upload' && <Upload />}
      {state.page === 'history' && <History />}
    </>
  )
}

export { useRouter }
