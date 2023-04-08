import {
  Button,
  Checkbox,
  Container,
  Link,
  Loading,
  Spacer,
} from '@nextui-org/react'
import { useState } from 'react'

import { HistoryItem } from './History'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { useItemsList } from '../utils/db'
import { useStore } from '../store'
import { writeIpfs } from '../utils/ipfs'

export default function Upload() {
  const { add } = useItemsList<HistoryItem>('upload-history')
  const { state, set } = useStore()

  const [uploading, setUploading] = useState(false)

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const cid = await writeIpfs(state.ipfsApi, state.content, {
        compress: state.compression,
      })
      await add({ id: cid, content: state.content })
      set({ cid })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container xs>
      <Input
        name="ipfsUrl"
        value={state.ipfsApi}
        label="IPFS Upload Url"
        placeholder="Enter an ipfs url..."
        onChange={(val) => set({ ipfsApi: val })}
        required
      />
      <Spacer />
      <Textarea
        name="content"
        value={state.content}
        label="File Content"
        placeholder="Enter file content..."
        onChange={(content) => set({ cid: '', content })}
        required
      />
      <Spacer y={0.3} />
      <Checkbox
        size="xs"
        isSelected={state.compression}
        onChange={(compression) => set({ cid: '', compression })}
      >
        Compress (zlib)
      </Checkbox>
      <Spacer />
      <Button
        css={{ minWidth: '100%' }}
        disabled={!state.ipfsApi || !state.content || uploading || !!state.cid}
        onPress={upload}
      >
        {uploading ? <Loading color="currentColor" size="xs" /> : 'Upload'}
      </Button>
      <Spacer y={0.5} />
      {state.cid && (
        <Link color="primary" href={`/${state.cid}`}>
          ← Preview: ipfs://{state.cid}
        </Link>
      )}
    </Container>
  )
}
