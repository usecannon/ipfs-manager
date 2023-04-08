import { createContext, useContext, useReducer } from 'react'

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

type SetActions = {
  [K in keyof State]: {
    type: 'SET'
    payload: { key: K; value: State[K] }
  }
}

type Action = { type: 'SET_STATE'; payload: Partial<State> }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const StoreContext = createContext<{
  state: State
  dispatch: (action: Action) => void
  set: (payload: Partial<State>) => void
} | null>(null)

export function useStore() {
  return useContext(StoreContext)!
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState
  )

  function set(payload: Partial<State>) {
    return dispatch({ type: 'SET_STATE', payload: payload })
  }

  return (
    <StoreContext.Provider value={{ state, dispatch, set }}>
      {children}
    </StoreContext.Provider>
  )
}
