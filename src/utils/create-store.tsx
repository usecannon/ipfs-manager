import { createContext, useContext, useReducer } from 'react'

const SET_STATE = '$$_SET_STATE'

type SetAction<State> = { type: typeof SET_STATE; payload: Partial<State> }

export function createStore<State, Action = { type: 'noop' }>(
  initialState: State,
  reducer?: (state: State, action: Action) => State
) {
  function baseReducer(state: State, action: Action & SetAction<State>) {
    switch (action.type) {
      case SET_STATE:
        return { ...state, ...action.payload }
      default:
        return reducer ? reducer(state, action) : state
    }
  }

  type Context = {
    state: State
    dispatch: (action: Action) => void
    set: (payload: Partial<State>) => void
  }

  const StoreContext = createContext<Context | null>(null)

  function useStore() {
    return useContext(StoreContext)!
  }

  function StoreProvider({ children }: { children: React.ReactNode }) {
    const [state, baseDispatch] = useReducer(
      baseReducer,
      initialState,
      (state) => ({ ...state })
    )

    function set(payload: Partial<State>) {
      return baseDispatch({ type: SET_STATE, payload })
    }

    const dispatch = (action: Action) => baseDispatch(action)

    return (
      <StoreContext.Provider value={{ state, dispatch, set }}>
        {children}
      </StoreContext.Provider>
    )
  }

  return { StoreProvider, useStore }
}
