import { createRouter } from './utils/create-router'
import type { State } from './store'

type Routes = {
  [K in State['page']]: string | string[]
}

const routes = {
  view: ['/', '/:cid'],
  upload: '/upload',
  history: '/history',
} satisfies Routes

const { RouterProvider, useRouter } = createRouter(routes)

export { RouterProvider, useRouter }
