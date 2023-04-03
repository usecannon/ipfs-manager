import { BrowserRouter } from 'react-router-dom'
import { Children, useState } from 'react'
import { Container, Spacer } from '@nextui-org/react'

import { Menu } from './Menu'

interface ItemProps {
  title: string
  children?: React.ReactNode | React.ReactNode[]
}

interface Props {
  children?: React.ReactElement<ItemProps> | React.ReactElement<ItemProps>[]
}

export function Layout({ children }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (Children.count(children) === 0) return null

  const menuItems = Children.map(children, (child) => ({
    title: child?.props.title || '',
  }))?.filter((item) => item !== undefined)

  if (!menuItems) return null

  return (
    <BrowserRouter>
      <Menu
        items={menuItems}
        value={currentIndex}
        onChange={(index) => setCurrentIndex(index)}
      />
      <Container xs>
        <Spacer y={2} />
        {Children.toArray(children)[currentIndex]}
      </Container>
    </BrowserRouter>
  )
}

export function Page({ children }: ItemProps) {
  return <>{children}</>
}
