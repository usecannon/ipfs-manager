import { Textarea as TextareaElement } from '@nextui-org/react'

interface Props {
  name: string
  value: string
  label: string
  placeholder?: string
  onChange?: (val: string) => void
  readOnly?: boolean
  required?: boolean
}

export function Textarea({
  name,
  value,
  placeholder,
  label,
  onChange,
  required,
  readOnly = false,
}: Props) {
  return (
    <TextareaElement
      name={name}
      value={value}
      label={label}
      placeholder={placeholder}
      onChange={(evt) => onChange && onChange(evt.target.value)}
      required={required}
      readOnly={readOnly}
      fullWidth
    />
  )
}
