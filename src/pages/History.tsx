import { Container, Grid, Modal, Table, Text, Tooltip } from '@nextui-org/react'
import { useState } from 'react'

import { DeleteIcon } from '../components/DeleteIcon'
import { EyeIcon } from '../components/EyeIcon'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { ItemBase, useItemsList } from '../utils/db'
import { Textarea } from '../components/Textarea'

export interface HistoryItem extends ItemBase {
  content: string
}

export default function History() {
  const { del, items } = useItemsList<HistoryItem>('upload-history')
  const [itemShowing, setItemShowing] = useState<HistoryItem | null>(null)

  return (
    <Container sm>
      <Modal
        width="auto"
        closeButton
        aria-labelledby="modal-title"
        open={!!itemShowing}
        onClose={() => setItemShowing(null)}
      >
        <Modal.Body>
          <Input
            name="cid"
            value={itemShowing?.id || ''}
            label={'CID'}
            readOnly
          />
          <Textarea
            name="content"
            value={itemShowing?.content || ''}
            label={'Content'}
            readOnly
          />
        </Modal.Body>
      </Modal>
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
                  <Text b>{item.id}</Text>
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Grid.Container gap={2} justify="space-around">
                  <IconButton onClick={() => setItemShowing(item)}>
                    <EyeIcon size={20} fill="#979797" />
                  </IconButton>
                  <IconButton onClick={() => del(item.id)}>
                    <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
                </Grid.Container>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}
