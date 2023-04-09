import { Navbar } from '@nextui-org/react'
import { State, useActions, useStore } from '../store'

const items = {
  view: 'View',
  upload: 'Upload',
  history: 'History',
} as const satisfies {
  [K in Exclude<State['page'], '404'>]: string
}

export function Menu() {
  const state = useStore()
  const { set } = useActions()

  return (
    <Navbar isCompact maxWidth="xs">
      <Navbar.Content />
      <Navbar.Content enableCursorHighlight variant={'underline'}>
        {Object.entries(items).map(([page, title]) => (
          <Navbar.Item
            key={page}
            isActive={page === state.page}
            onClick={() => set({ page: page as State['page'] })}
            css={{ cursor: 'pointer' }}
          >
            {title}
          </Navbar.Item>
        ))}
      </Navbar.Content>
      <Navbar.Content />
    </Navbar>
  )
}
