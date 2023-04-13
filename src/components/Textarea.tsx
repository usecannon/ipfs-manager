import { Text, Textarea as TextareaElement } from '@chakra-ui/react'

interface Props {
  name: string
  value: string
  label?: string
  ariaLabel?: string
  placeholder?: string
  onChange?: (val: string) => void
  readOnly?: boolean
  required?: boolean
  valid?: boolean
}

export function Textarea({
  name,
  value,
  placeholder,
  label,
  ariaLabel,
  onChange,
  required,
  readOnly = false,
  valid = true,
}: Props) {
  return (
    <>
      {label && <Text mb="8px">{label}</Text>}
      <TextareaElement
        name={name}
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(evt) => onChange && onChange(evt.target.value)}
        isRequired={required}
        isReadOnly={readOnly}
        isInvalid={!valid}
        resize="vertical"
        minH={250}
        variant={readOnly ? 'filled' : 'outline'}
      />
    </>
  )
}
