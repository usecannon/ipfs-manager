import { Button, Container, Link, Loading, Spacer } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import { HistoryItem } from './History'
import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs, writeIpfs } from '../utils/ipfs'
import { useItemsList } from '../utils/db'

export default function Upload() {
  const { add } = useItemsList<HistoryItem>('upload-history')

  const [ipfsUploadUrl, setIpfsUploadUrl] = useState('http://localhost:5001')
  const [content, setContent] = useState('')
  const [uploadedCid, setUploadedCid] = useState('')

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setUploadedCid('')
  }, [content])

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const hash = await writeIpfs(ipfsUploadUrl, content)
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
      <Spacer />
      {uploadedCid ? (
        <Button css={{ minWidth: '100%' }} light color="success">
          <Link href={`/${uploadedCid}`}>Preview: ipfs://{uploadedCid}</Link>
        </Button>
      ) : (
        <Button
          css={{ minWidth: '100%' }}
          disabled={!ipfsUploadUrl || !content || uploading}
          onPress={upload}
        >
          {uploading ? <Loading color="currentColor" size="sm" /> : 'Upload'}
        </Button>
      )}
    </Container>
  )
}
