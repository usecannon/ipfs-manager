import {
  Input as InputElement,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
} from '@chakra-ui/react'

interface Props {
  name: string
  value: string
  label?: string
  labelLeft?: React.ReactNode
  onChange?: (val: string) => void
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  isInvalid?: boolean
  contentRight?: React.ReactNode
}

export function Input({
  name,
  value,
  placeholder,
  label,
  labelLeft,
  onChange,
  readOnly,
  required,
  isInvalid,
  contentRight,
}: Props) {
  return (
    <>
      {label && <Text>{label}</Text>}
      <InputGroup>
        {labelLeft && <InputLeftAddon children={labelLeft} />}
        <InputElement
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(evt) => onChange && onChange(evt.target.value)}
          required={required}
          isDisabled={readOnly}
          isInvalid={isInvalid}
        />
        {contentRight && <InputRightAddon children={contentRight} />}
      </InputGroup>
    </>
  )
}
