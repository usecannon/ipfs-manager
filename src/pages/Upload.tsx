import { Button, Container, Spacer } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs, writeIpfs } from '../utils/ipfs'

export default function Upload() {
  const [ipfsUrl, setIpfsUrl] = useState('http://localhost:5001')
  const [content, setContent] = useState('')

  const [previewUrl, setPreviewUrl] = useState('')
  const [previewContent, setPreviewContent] = useState('')

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    readPreview()
  }, [previewUrl])

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const hash = await writeIpfs(ipfsUrl, content)
      setPreviewUrl(`ipfs://${hash}`)
    } finally {
      setUploading(false)
    }
  }

  async function readPreview() {
    const hash = parseIpfsHash(previewUrl)
    if (!hash) return setPreviewContent('')
    const newContent = await readIpfs(ipfsUrl, hash)
    setPreviewContent(newContent)
  }

  return (
    <Container xs>
      <Input
        name="ipfsUrl"
        value={ipfsUrl}
        label={'IPFS Node Url'}
        placeholder={'Enter and ipfs url...'}
        onChange={setIpfsUrl}
        required
      />
      <Spacer />
      <Textarea
        name="content"
        value={content}
        label={'File Content'}
        placeholder={'Enter file content...'}
        onChange={setContent}
        required
      />
      <Spacer />
      <Button
        css={{ minWidth: '100%' }}
        disabled={!ipfsUrl || !content || uploading}
        onPress={upload}
      >
        Upload
      </Button>
      <Spacer y={2} />
      <Input
        name="previewUrl"
        value={previewUrl}
        label={'Preview File'}
        placeholder={'ipfs://Qm...'}
        onChange={setPreviewUrl}
        valid={!previewUrl || !!parseIpfsHash(previewUrl)}
        required
      />
      <Spacer />
      <Textarea
        name="previewContent"
        value={previewContent}
        label={'Preview Content'}
        readOnly
        required
      />
    </Container>
  )
}
