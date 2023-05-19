import {
  Alert,
  AlertIcon,
  Checkbox,
  Code,
  Container,
  Select,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { CIDInput } from '../components/CIDInput'
import { FORMAT } from '../store'
import { Format } from '../store'
import { Input } from '../components/Input'
import { Space } from '../components/Space'
import { Textarea } from '../components/Textarea'
import { readIpfs } from '../utils/ipfs'
import { useActions, useStore } from '../store'

const formatTitles = { text: 'Text', json: 'JSON' } as const

export function Download() {
  const state = useStore()
  const { set } = useActions()

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

    setError('')
    set({ content: '' })

    async function downloadContent() {
      try {
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

    return () => {
      setDownloading(false)
    }
  }, [state.ipfsGateway, state.cid, state.compression])

  return (
    <>
      <Container maxW="100%" w="container.sm">
        <Input
          name="ipfsGatewayUrl"
          value={state.ipfsGateway}
          label="IPFS Gateway"
          placeholder="Enter an ipfs url..."
          onChange={(ipfsGateway) => set({ ipfsGateway })}
          required
        />
        <Space />
        <CIDInput
          initialValue={state.cid}
          onChange={(cid) => set({ cid })}
          isLoading={downloading}
        />
        <Checkbox
          defaultChecked={state.compression}
          onChange={(evt) => set({ compression: evt.target.checked })}
        >
          Decompress (zlib)
        </Checkbox>
        <Space />
        <Text>Format</Text>
        <Select
          value={state.format}
          onChange={(evt) => set({ format: evt.target.value as Format })}
        >
          {FORMAT.map((format) => (
            <option key={format} value={format}>
              {formatTitles[format]}
            </option>
          ))}
        </Select>
        <Space />
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {state.format !== 'json' && !error && (
          <Textarea
            label="Content"
            name="content"
            value={error || state.content}
            readOnly
            required
          />
        )}
      </Container>
      {state.format === 'json' && !error && jsonContent && (
        <Container maxW="100%" w="container.lg">
          <Code
            paddingY="3"
            paddingX="4"
            display="block"
            whiteSpace="pre-wrap"
            children={JSON.stringify(jsonContent, null, 2)}
          />
        </Container>
      )}
    </>
  )
}
