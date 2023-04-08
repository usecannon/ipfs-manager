import { NextUIProvider, Spacer } from '@nextui-org/react'
import { navigate, useMatch, useRoutes } from 'raviger'

import History from './pages/History'
import Upload from './pages/Upload'
import View from './pages/View'
import { Menu } from './components/Menu'
import { StoreProvider } from './store'

const pages = {
  '/': () => <View />,
  '/upload': () => <Upload />,
  '/history': () => <History />,
  '/:cid': ({ cid }: { cid: string }) => <View cid={cid} />,
}

const titles = [{ title: 'View' }, { title: 'Upload' }, { title: 'History' }]

const titleIndex = {
  '/': 0,
  '/upload': 1,
  '/history': 2,
  '/:cid': 0,
}

function useTitleIndex() {
  let index = -1
  for (const [path, i] of Object.entries(titleIndex)) {
    if (useMatch(path) && index === -1) index = i
  }
  return index
}

function getPath(index: number) {
  return Object.entries(titleIndex).find(([, i]) => i === index)?.[0] || '/'
}

export function App() {
  const route = useRoutes(pages)
  const titleIndex = useTitleIndex()

  if (!route) return <p>Page Not Found</p>

  return (
    <NextUIProvider>
      <StoreProvider>
        <Menu
          items={titles}
          value={titleIndex}
          onChange={(index) => navigate(getPath(index))}
        />
        <Spacer />
        {route}
      </StoreProvider>
    </NextUIProvider>
  )
}
