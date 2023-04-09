import rfdc from 'rfdc'
import { createContext, useContext, useState } from 'react'

const clone = rfdc()

type BaseState = { [key: string]: any }
type BaseActions<State> = {
  [name: string]: (state: State, ...params: any[]) => State
}

export function createStore<
  State extends BaseState,
  Actions extends BaseActions<State>
>(initialState: State, actions: Actions) {
  interface Context {
    state: State
    setState: (state: State) => void
  }

  const StoreContext = createContext<Context>({
    state: initialState,
    setState: () => {
      throw new Error('Context not initialized')
    },
  })

  function useStore() {
    const { state } = useContext(StoreContext)
    return clone(state)
  }

  function useActions() {
    const { state, setState } = useContext(StoreContext)

    type Result = {
      [K in keyof Actions]: Parameters<Actions[K]>[1] extends undefined
        ? () => void
        : Parameters<Actions[K]>[2] extends undefined
        ? (param: Parameters<Actions[K]>[1]) => void
        : (
            param1: Parameters<Actions[K]>[1],
            param2?: Parameters<Actions[K]>[2]
          ) => void
    }

    const result: any = {}
    const keys = Object.keys(actions) as (keyof Actions)[]

    for (const key of keys) {
      const action = actions[key]
      result[key] = (
        param1: Parameters<typeof action>[1],
        param2?: Parameters<typeof action>[2]
      ) => {
        setState(action(state as State, param1, param2) as State)
      }
    }

    return result as Result
  }

  function StoreProvider({
    children,
    ...props
  }: {
    children: React.ReactNode
    initialState?: Partial<State>
  }) {
    const [state, setState] = useState({
      ...initialState,
      ...props.initialState,
    })

    return (
      <StoreContext.Provider value={{ state, setState }}>
        {children}
      </StoreContext.Provider>
    )
  }

  return { StoreProvider, useStore, useActions }
}
