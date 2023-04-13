import {
  Text,
  Flex,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Spacer,
  Container,
} from '@chakra-ui/react'

import { Page, useActions, useStore } from '../store'

const pages = ['view', 'upload', 'history'] as const satisfies readonly Page[]
const titles = ['View', 'Upload', 'History'] as const

export function Menu() {
  const state = useStore()
  const { set } = useActions()

  return (
    <Container maxW="100%" w="container.sm" pr="0.4" paddingY={4}>
      <Flex>
        <Text fontSize="2xl">IPFS Manager</Text>
        <Spacer />
        <Tabs
          position="relative"
          variant="unstyled"
          index={pages.findIndex((page) => page === state.page)}
          onChange={(index) => set({ page: pages[index]! })}
        >
          <TabList>
            {pages.map((page, index) => (
              <Tab key={page} css={{ cursor: 'pointer' }}>
                {titles[index]}
              </Tab>
            ))}
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
        </Tabs>
      </Flex>
    </Container>
  )
}
