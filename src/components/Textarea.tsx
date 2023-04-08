import { Textarea as TextareaElement } from '@nextui-org/react'

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
    <TextareaElement
      name={name}
      initialValue={value}
      aria-label={ariaLabel}
      label={label}
      placeholder={placeholder}
      onChange={(evt) => onChange && onChange(evt.target.value)}
      required={required}
      readOnly={readOnly}
      color={valid ? 'default' : 'error'}
      status={valid ? 'default' : 'error'}
      animated={false}
      fullWidth
    />
  )
}
