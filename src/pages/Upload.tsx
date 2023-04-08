import {
  Button,
  Checkbox,
  Container,
  Link,
  Loading,
  Spacer,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'

import { HistoryItem } from './History'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { useItemsList } from '../utils/db'
import { writeIpfs } from '../utils/ipfs'

export default function Upload() {
  const { add } = useItemsList<HistoryItem>('upload-history')

  const [ipfsUploadUrl, setIpfsUploadUrl] = useState('http://localhost:5001')
  const [content, setContent] = useState('')
  const [uploadedCid, setUploadedCid] = useState('')
  const [compress, setCompress] = useState(false)

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setUploadedCid('')
  }, [compress, content])

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const hash = await writeIpfs(ipfsUploadUrl, content, { compress })
      await add({ id: hash, content })
      setUploadedCid(hash)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container xs>
      <Input
        name="ipfsUrl"
        value={ipfsUploadUrl}
        label="IPFS Upload Url"
        placeholder="Enter an ipfs url..."
        onChange={setIpfsUploadUrl}
        required
      />
      <Spacer />
      <Textarea
        name="content"
        value={content}
        label="File Content"
        placeholder="Enter file content..."
        onChange={setContent}
        required
      />
      <Spacer y={0.3} />
      <Checkbox size="xs" onChange={setCompress}>
        Compress (zlib)
      </Checkbox>
      <Spacer />
      {uploadedCid ? (
        <Button light color="success">
          <Link href={`/${uploadedCid}`}>← Preview: ipfs://{uploadedCid}</Link>
        </Button>
      ) : (
        <Button
          css={{ minWidth: '100%' }}
          disabled={!ipfsUploadUrl || !content || uploading}
          onPress={upload}
        >
          {uploading ? <Loading color="currentColor" size="xs" /> : 'Upload'}
        </Button>
      )}
    </Container>
  )
}
