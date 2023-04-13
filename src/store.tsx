import { createStore } from './utils/create-store'

export const PAGE = ['view', 'upload', 'history', '404'] as const
export const FORMAT = ['text', 'json'] as const

export type Format = (typeof FORMAT)[number]
export type Page = (typeof PAGE)[number]

export interface State {
  page: Page
  ipfsGateway: string
  ipfsApi: string
  cid: string
  content: string
  compression: boolean
  format: Format
}

const initialState = {
  page: 'view',
  ipfsGateway: 'https://ipfs.io',
  ipfsApi: 'http://localhost:5001',
  cid: '',
  content: '',
  compression: false,
  format: 'text',
} satisfies State

const actions = {
  set(state: State, payload: Partial<State>): State {
    return { ...state, ...payload }
  },

  view(state: State, cid: string): State {
    if (state.cid === cid) return { ...state, page: 'view' }
    return {
      ...state,
      page: 'view',
      cid,
      content: '',
      compression: false,
      format: 'text',
    }
  },
} as const

const { StoreProvider, useStore, useActions } = createStore<
  State,
  typeof actions
>(initialState, actions)

export { StoreProvider, useStore, useActions }
