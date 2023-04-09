import { Container, Link, Table, Text } from '@nextui-org/react'

import { DeleteIcon } from '../components/DeleteIcon'
import { IconButton } from '../components/IconButton'
import { ItemBase, useItemsList } from '../utils/db'
import { useActions } from '../store'

export interface HistoryItem extends ItemBase {}

export function History() {
  const { view } = useActions()
  const { del, items } = useItemsList<HistoryItem>('upload-history')

  return (
    <Container sm>
      <Table
        aria-label="List of all the files uploaded to IPFS"
        css={{ height: 'auto', minWidth: '100%' }}
        selectionMode="none"
      >
        <Table.Header>
          <Table.Column>Created</Table.Column>
          <Table.Column>CID</Table.Column>
          <Table.Column>&nbsp;</Table.Column>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Text size={14}>{new Date(item.createdAt).toISOString()}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text size={14} css={{ fontFamily: 'monospace' }}>
                  <Link color="primary" onPress={() => view(item.id)}>
                    ipfs://{item.id}
                  </Link>
                </Text>
              </Table.Cell>
              <Table.Cell>
                <IconButton onClick={() => del(item.id)}>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}
