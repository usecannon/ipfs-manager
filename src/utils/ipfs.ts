import FormData from 'form-data'
import axios from 'axios'
import { Buffer } from 'buffer'
import { create as createUrl, parse as parseUrl } from 'simple-url'

const FILE_URL_REGEX = /^(?:ipfs:\/\/|@ipfs:)?(?<cid>[a-zA-Z0-9]{46})$/

export function parseIpfsHash(url: string) {
  if (typeof url !== 'string') throw new Error('Invalid url')
  if (!url) return ''
  return url.trim().match(FILE_URL_REGEX)?.groups?.cid || ''
}

// Create an ipfs url with compatibility for custom auth and https+ipfs:// protocol
export function createIpfsUrl(base: string, pathname: string) {
  const parsedUrl = parseUrl(base)
  const headers: { [k: string]: string } = {}

  const customProtocol = parsedUrl.protocol.endsWith('+ipfs')

  const uri = {
    protocol: customProtocol
      ? parsedUrl.protocol.split('+')[0]
      : parsedUrl.protocol,
    host:
      customProtocol && !parsedUrl.host.includes(':')
        ? `${parsedUrl.host}:5001`
        : parsedUrl.host,
    pathname,
    query: parsedUrl.query,
    hash: parsedUrl.hash,
  }

  if (parsedUrl.auth) {
    const [username, password] = parsedUrl.auth.split(':')
    headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`
  }

  return { url: createUrl(uri), headers }
}

export async function writeIpfs(ipfsUrl: string, content: string) {
  if (!content) throw new Error('No content to upload')

  const { url, headers } = createIpfsUrl(ipfsUrl, '/api/v0/add')
  const formData = new FormData()
  const buff = Buffer.from(content)

  formData.append('data', Buffer.from(buff))

  const res = await axios.post(url, formData, { headers })

  console.log('uploaded', res.statusText, res.data.Hash)

  return res.data.Hash
}

export async function readIpfs(ipfsUrl: string, cid: string): Promise<any> {
  const { url, headers } = createIpfsUrl(ipfsUrl, `/api/v0/cat?arg=${cid}`)

  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    responseEncoding: 'application/octet-stream',
    headers,
  })

  return res.data
}
