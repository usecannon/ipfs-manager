import { Input as InputElement } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  name: string
  value: string
  label?: string
  labelLeft?: string
  onChange?: (val: string) => void
  placeholder?: string
  validate?: (val: string) => boolean
  parse?: (val: string) => string
  readOnly?: boolean
  required?: boolean
  contentRight?: React.ReactNode
}

export function Input({
  name,
  value,
  placeholder,
  label,
  labelLeft,
  onChange,
  validate = () => true,
  parse = (val) => val,
  readOnly,
  required,
  contentRight,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentValue, setValue] = useState(value)
  const [valid, setValid] = useState(validate(value))

  useEffect(() => {
    const parsedValue = parse(currentValue)
    setValid(validate(parsedValue))
    if (onChange) onChange(parsedValue)

    if (parsedValue !== currentValue && inputRef.current) {
      inputRef.current.value = parsedValue
    }
  }, [currentValue])

  return (
    <InputElement
      name={name}
      initialValue={value}
      label={label}
      labelLeft={labelLeft}
      placeholder={placeholder}
      onChange={(evt) => setValue(evt.target.value)}
      color={valid ? 'default' : 'error'}
      status={valid ? 'default' : 'error'}
      required={required}
      readOnly={readOnly}
      contentRight={contentRight}
      animated={false}
      fullWidth
      ref={inputRef}
    />
  )
}
