import { Checkbox, Container, Loading, Spacer } from '@nextui-org/react'
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
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [decompress, setDecompress] = useState(false)

  useEffect(() => {
    const parsedHash = parseIpfsHash(fileUrl)
    if (parsedHash && cid !== parsedHash) navigate(`/${parsedHash}`)
    if (!parsedHash) return setContent('')
    if (parsedHash !== fileUrl) return setFileUrl(parsedHash)

    async function downloadContent() {
      try {
        setError('')
        setDownloading(true)
        setContent(await readIpfs(ipfsGatewayUrl, parsedHash, { decompress }))
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : (err as Error)?.message || 'Unknown error'
        )
      } finally {
        setDownloading(false)
      }
    }

    downloadContent()
  }, [decompress, ipfsGatewayUrl, fileUrl])

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
      <Spacer y={0.3} />
      <Checkbox size="xs" onChange={setDecompress}>
        Decompress (zlib)
      </Checkbox>
      <Spacer />
      <Textarea
        name="previewContent"
        value={error || content}
        label="Content"
        valid={!error}
        readOnly
        required
      />
    </Container>
  )
}
