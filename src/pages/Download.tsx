import ReactJson from 'react-json-view'
import {
  Card,
  Checkbox,
  Container,
  Dropdown,
  Grid,
  Loading,
  Spacer,
  Text,
} from '@nextui-org/react'
import { navigate } from 'raviger'
import { useEffect, useState } from 'react'

import { Input } from '../components/Input'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs, writeIpfs } from '../utils/ipfs'

interface Props {
  cid?: string
}

const FORMAT = {
  text: 'Text',
  json: 'JSON',
} as const

export default function Download({ cid = '' }: Props) {
  const [ipfsGatewayUrl, setIpfsGatewayUrl] = useState('https://ipfs.io')
  const [fileUrl, setFileUrl] = useState(cid)
  const [content, setContent] = useState('')
  const [jsonContent, setJsonContent] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [decompress, setDecompress] = useState(false)
  const [format, setFormat] = useState<keyof typeof FORMAT>('text')

  useEffect(() => {
    if (format !== 'json') {
      if (error === 'Could not parse JSON content') setError('')
      return setJsonContent('')
    }

    try {
      setJsonContent(JSON.parse(content || '""'))
      setError('')
    } catch (err) {
      setJsonContent('')
      setError('Could not parse JSON content')
    }
  }, [format, content])

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
    <>
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
        <Grid.Container justify="space-between">
          <Grid css={{ display: 'inline-flex' }} alignItems="flex-end">
            <Text
              size="$sm"
              css={{
                paddingLeft: '$2',
                fontWeight: '$normal',
                marginBottom: '$3',
              }}
              as="label"
            >
              Content
            </Text>
          </Grid>
          <Grid>
            <Dropdown>
              <Dropdown.Button light>{FORMAT[format]}</Dropdown.Button>
              <Dropdown.Menu
                variant="light"
                selectionMode="single"
                aria-label="Format"
                disallowEmptySelection
                selectedKeys={[format]}
                onSelectionChange={(val) =>
                  setFormat(Array.from(val)[0] as keyof typeof FORMAT)
                }
              >
                {Object.entries(FORMAT).map(([name, title]) => (
                  <Dropdown.Item key={name}>{title}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Grid>
        </Grid.Container>
        {(format !== 'json' || !jsonContent) && (
          <Textarea
            ariaLabel="Content"
            name="content"
            value={error || content}
            valid={!error}
            readOnly
            required
          />
        )}
      </Container>
      {format === 'json' && jsonContent && (
        <Container sm>
          <Spacer y={0.5} />
          <Card>
            <Card.Body css={{ padding: '$12 $14' }}>
              <ReactJson src={jsonContent as object} />
            </Card.Body>
          </Card>
          <Spacer />
        </Container>
      )}
    </>
  )
}
