import { NextUIProvider } from '@nextui-org/react'

import Upload from './pages/Upload'
import { Layout, Page } from './components/Layout'

export function App() {
  return (
    <NextUIProvider>
      <Layout>
        <Page title="Upload">
          <Upload />
        </Page>
        <Page title="History"></Page>
      </Layout>
    </NextUIProvider>
  )
}
