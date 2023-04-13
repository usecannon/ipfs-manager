import { Button, Checkbox, Container, Link } from '@chakra-ui/react'
import { useState } from 'react'

import { HistoryItem } from './History'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { useActions, useStore } from '../store'
import { useItemsList } from '../utils/db'
import { writeIpfs } from '../utils/ipfs'

export function Upload() {
  const { add } = useItemsList<HistoryItem>('upload-history')
  const state = useStore()
  const { set, view } = useActions()

  const [uploading, setUploading] = useState(false)

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const cid = await writeIpfs(state.ipfsApi, state.content, {
        compress: state.compression,
      })
      await add({ id: cid })
      set({ cid })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container maxW="100%" w="container.sm">
      <Input
        name="ipfsUrl"
        value={state.ipfsApi}
        label="IPFS Upload Url"
        placeholder="Enter an ipfs url..."
        onChange={(val) => set({ ipfsApi: val })}
        required
      />
      <Textarea
        name="content"
        value={state.content}
        label="File Content"
        placeholder="Enter file content..."
        onChange={(content) => set({ cid: '', content })}
        required
      />
      <Checkbox
        defaultChecked={state.compression}
        onChange={(evt) => set({ cid: '', compression: evt.target.checked })}
      >
        Compress (zlib)
      </Checkbox>
      <Button
        width="100%"
        isLoading={uploading}
        disabled={!state.ipfsApi || !state.content || uploading || !!state.cid}
        onClick={upload}
      >
        Upload
      </Button>
      {state.cid && (
        <Link fontSize="sm" onClick={() => view(state.cid)}>
          ← Preview: ipfs://{state.cid}
        </Link>
      )}
    </Container>
  )
}
