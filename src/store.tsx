import { createStore } from './utils/create-store'

export interface State {
  ipfsGateway: string
  ipfsApi: string
  cid: string
  content: string
  compression: boolean
  format: 'text' | 'json'
}

const initialState = {
  ipfsGateway: 'https://ipfs.io',
  ipfsApi: 'http://localhost:5001',
  cid: '',
  content: '',
  compression: false,
  format: 'text',
} satisfies State

const { StoreProvider, useStore } = createStore<State>(initialState)

export { StoreProvider, useStore }
