import { NextUIProvider, Spacer } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import { History } from './pages/History'
import { Menu } from './components/Menu'
import { RouterProvider, useRouter } from './routes'
import { StoreProvider, useActions, useStore } from './store'
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
  const { page, params } = useRouter()

  return (
    <BaseProvider>
      <StoreProvider initialState={{ page, ...params }}>
        <Content />
      </StoreProvider>
    </BaseProvider>
  )
}

function Content() {
  const state = useStore()
  const { set } = useActions()
  const { page, params, navigate } = useRouter()

  useEffect(() => {
    set({ page, ...params })
  }, [])

  useEffect(() => {
    if (state.page === 'view') {
      const replace = state.page === page
      navigate(`/${state.cid}`, { replace })
    } else {
      navigate(`/${state.page}`)
    }
  }, [state.page])

  useEffect(() => {
    if (state.page === 'view') {
      navigate(`/${state.cid}`, { replace: true })
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
