import {
  Container,
  IconButton,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import { ItemBase, useItemsList } from '../utils/db'
import { useActions } from '../store'

export interface HistoryItem extends ItemBase {}

export function History() {
  const { view } = useActions()
  const { del, items } = useItemsList<HistoryItem>('upload-history')

  return (
    <Container maxW="100%" w="container.lg">
      <TableContainer>
        <Table size="sm" aria-label="List of all the files uploaded to IPFS">
          <Thead>
            <Tr>
              <Th>Created</Th>
              <Th>CID</Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td>{new Date(item.createdAt).toISOString()}</Td>
                <Td>
                  <Link onClick={() => view(item.id)}>ipfs://{item.id}</Link>
                </Td>
                <Td>
                  <IconButton
                    size="sm"
                    aria-label="Delete"
                    onClick={() => del(item.id)}
                    icon={<DeleteIcon />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}
