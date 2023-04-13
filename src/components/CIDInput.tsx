import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Input } from './Input'
import { parseIpfsHash } from '../utils/ipfs'

interface Props {
  initialValue: string
  isLoading?: boolean
  onChange?: (val: string) => void
}

export function CIDInput({ initialValue = '', onChange, isLoading }: Props) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const cid = parseIpfsHash(value)
    if (cid) setValue(cid)
    if (onChange) onChange(cid)
  }, [value])

  return (
    <Input
      name="cid"
      value={value}
      label="CID"
      labelLeft="ipfs://"
      placeholder="Qm..."
      onChange={setValue}
      isInvalid={!!value && !parseIpfsHash(value)}
      contentRight={isLoading ? <Button isLoading variant="ghost" /> : null}
      required
    />
  )
}
