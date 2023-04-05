import { Container, Loading, Spacer } from '@nextui-org/react'
import { navigate } from 'raviger'
import { useEffect, useState } from 'react'

import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs, writeIpfs } from '../utils/ipfs'

interface Props {
  cid?: string
}

export default function Download({ cid = '' }: Props) {
  const [ipfsGatewayUrl, setIpfsGatewayUrl] = useState('https://ipfs.io')
  const [fileUrl, setFileUrl] = useState(cid)
  const [content, setContent] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const parsedHash = parseIpfsHash(fileUrl)
    if (parsedHash && cid !== parsedHash) navigate(`/${parsedHash}`)
    if (!parsedHash) return setContent('')
    if (parsedHash !== fileUrl) return setFileUrl(parsedHash)

    async function downloadContent() {
      try {
        setDownloading(true)
        setContent(await readIpfs(ipfsGatewayUrl, parsedHash))
      } finally {
        setDownloading(false)
      }
    }

    downloadContent()
  }, [fileUrl])

  return (
    <Container xs>
      <Input
        name="ipfsGatewayUrl"
        value={ipfsGatewayUrl}
        label="IPFS Gateway"
        placeholder="Enter an ipfs url..."
        onChange={setIpfsGatewayUrl}
        required
      />
      <Spacer />
      <Input
        name="cid"
        value={cid}
        label="CID"
        labelLeft="ipfs://"
        placeholder="Qm..."
        onChange={setFileUrl}
        valid={!fileUrl || !!parseIpfsHash(fileUrl)}
        required
        contentRight={downloading ? <Loading size="xs" /> : null}
      />
      <Spacer />
      <Textarea
        name="previewContent"
        value={content}
        label="Content"
        readOnly
        required
      />
    </Container>
  )
}
