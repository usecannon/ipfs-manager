import { createRouter } from './utils/create-router'
import type { State } from './store'

type Routes = {
  [K in State['page']]: string | string[]
}

const routes = {
  download: ['/', '/:cid'],
  upload: '/upload',
  history: '/history',
  '404': '/404',
} satisfies Routes

const { RouterProvider, useRouter } = createRouter(routes)

export { RouterProvider, useRouter }
