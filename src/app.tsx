import qs from 'qs'
import { NextUIProvider, Spacer } from '@nextui-org/react'
import { useEffect } from 'react'

import { Format, Page, StoreProvider, useStore } from './store'
import { History } from './pages/History'
import { Menu } from './components/Menu'
import { RouterProvider, useRouter } from './routes'
import { Upload } from './pages/Upload'
import { View } from './pages/View'

function BaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <RouterProvider>{children}</RouterProvider>
    </NextUIProvider>
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
          format: Object.values(Format).includes(query.format as Format)
            ? (query.format as Format)
            : Format.Text,
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
    if (state.format !== Format.Text) query.format = state.format
    if (Object.keys(query).length === 0) return ''
    return `?${qs.stringify(query)}`
  }

  useEffect(() => {
    console.log()
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
      <Spacer />
      {state.page === 'view' && <View />}
      {state.page === 'upload' && <Upload />}
      {state.page === 'history' && <History />}
    </>
  )
}

export { useRouter }
