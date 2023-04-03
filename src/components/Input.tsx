import { Input as InputElement } from '@nextui-org/react'

interface Props {
  name: string
  value: string
  label: string
  onChange: (val: string) => void
  placeholder?: string
  valid?: boolean
  required?: boolean
}

export function Input({
  name,
  value,
  placeholder,
  label,
  onChange,
  valid = true,
  required,
}: Props) {
  return (
    <InputElement
      name={name}
      value={value}
      label={label}
      placeholder={placeholder}
      onChange={(evt) => onChange(evt.target.value)}
      color={valid ? 'default' : 'error'}
      status={valid ? 'default' : 'error'}
      required={required}
      fullWidth
    />
  )
}
