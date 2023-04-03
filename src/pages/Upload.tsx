import { Button, Container, Spacer } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs, writeIpfs } from '../utils/ipfs'

export default function Upload() {
  const [ipfsUploadUrl, setIpfsUploadUrl] = useState('http://localhost:5001')
  const [content, setContent] = useState('')

  const [ipfsDownloadUrl, setIpfsDownloadUrl] = useState('https://ipfs.io')
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewContent, setPreviewContent] = useState('')

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    downloadPreview()
  }, [previewUrl])

  async function upload() {
    if (uploading) return
    setUploading(true)

    try {
      const hash = await writeIpfs(ipfsUploadUrl, content)
      setPreviewUrl(`ipfs://${hash}`)
    } finally {
      setUploading(false)
    }
  }

  async function downloadPreview() {
    const hash = parseIpfsHash(previewUrl)
    if (!hash) return setPreviewContent('')
    const newContent = await readIpfs(ipfsDownloadUrl, hash)
    setPreviewContent(newContent)
  }

  return (
    <Container xs>
      <Input
        name="ipfsUrl"
        value={ipfsUploadUrl}
        label={'IPFS Upload Url'}
        placeholder={'Enter and ipfs url...'}
        onChange={setIpfsUploadUrl}
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
        disabled={!ipfsUploadUrl || !content || uploading}
        onPress={upload}
      >
        Upload
      </Button>
      <Spacer y={2} />
      <Input
        name="ipfsDownloadUrl"
        value={ipfsDownloadUrl}
        label={'IPFS Download Url'}
        placeholder={'Enter and ipfs url...'}
        onChange={setIpfsDownloadUrl}
        required
      />
      <Spacer />
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
