import { createStore } from './utils/create-store'

export enum Format {
  Text = 'text',
  JSON = 'json',
}

export enum Page {
  View = 'view',
  Upload = 'upload',
  History = 'history',
  NotFound = '404',
}

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
  page: Page.View,
  ipfsGateway: 'https://ipfs.io',
  ipfsApi: 'http://localhost:5001',
  cid: '',
  content: '',
  compression: false,
  format: Format.Text,
} satisfies State

const actions = {
  set(state: State, payload: Partial<State>): State {
    return { ...state, ...payload }
  },

  view(state: State, cid: string): State {
    if (state.cid === cid) return { ...state, page: Page.View }
    return {
      ...state,
      page: Page.View,
      cid,
      content: '',
      compression: false,
      format: Format.Text,
    }
  },
} as const

const { StoreProvider, useStore, useActions } = createStore<
  State,
  typeof actions
>(initialState, actions)

export { StoreProvider, useStore, useActions }
