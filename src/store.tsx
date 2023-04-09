import { createStore } from './utils/create-store'

export interface State {
  page: 'view' | 'upload' | 'history' | '404'
  ipfsGateway: string
  ipfsApi: string
  cid: string
  content: string
  compression: boolean
  format: 'text' | 'json'
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
  set(state: State, payload: Partial<State>) {
    return { ...state, ...payload }
  },

  view(state: State, cid: string) {
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
