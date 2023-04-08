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
import { State, useStore } from '../store'
import { Textarea } from '../components/Textarea'
import { parseIpfsHash, readIpfs } from '../utils/ipfs'

const FORMAT_LABEL = {
  text: 'Text',
  json: 'JSON',
} satisfies { [K in State['format']]: string }

export default function View() {
  const { state, set } = useStore()

  const [jsonContent, setJsonContent] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (state.format !== 'json') {
      if (error === 'Could not parse JSON content') setError('')
      return setJsonContent('')
    }

    try {
      setJsonContent(JSON.parse(state.content || '""'))
      setError('')
    } catch (err) {
      setJsonContent('')
      setError('Could not parse JSON content')
    }
  }, [state.format, state.content])

  useEffect(() => {
    if (!state.cid || !state.ipfsGateway) return set({ content: '' })

    async function downloadContent() {
      try {
        setError('')
        setDownloading(true)
        const newContent = await readIpfs(state.ipfsGateway, state.cid, {
          decompress: state.compression,
        })
        set({ content: newContent })
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
  }, [state.ipfsGateway, state.cid, state.compression])

  return (
    <>
      <Container xs>
        <Input
          name="ipfsGatewayUrl"
          value={state.ipfsGateway}
          label="IPFS Gateway"
          placeholder="Enter an ipfs url..."
          onChange={(ipfsGateway) => set({ ipfsGateway })}
          required
        />
        <Spacer />
        <Input
          name="cid"
          value={state.cid}
          label="CID"
          labelLeft="ipfs://"
          placeholder="Qm..."
          onChange={(url) => set({ cid: parseIpfsHash(url) })}
          validate={(url) => !url || !!parseIpfsHash(url)}
          parse={(url) => parseIpfsHash(url) || url}
          required
          contentRight={downloading ? <Loading size="xs" /> : null}
        />
        <Spacer y={0.3} />
        <Checkbox
          size="xs"
          isSelected={state.compression}
          onChange={(compression) => set({ compression })}
        >
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
              <Dropdown.Button light>
                {FORMAT_LABEL[state.format]}
              </Dropdown.Button>
              <Dropdown.Menu
                variant="light"
                selectionMode="single"
                aria-label="Format"
                disallowEmptySelection
                selectedKeys={[state.format]}
                onSelectionChange={(val) =>
                  set({ format: Array.from(val)[0] as State['format'] })
                }
              >
                {Object.entries(FORMAT_LABEL).map(([name, title]) => (
                  <Dropdown.Item key={name}>{title}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Grid>
        </Grid.Container>
        {(state.format !== 'json' || !jsonContent) && (
          <Textarea
            ariaLabel="Content"
            name="content"
            value={error || state.content}
            valid={!error}
            readOnly
            required
          />
        )}
      </Container>
      {state.format === 'json' && jsonContent && (
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
