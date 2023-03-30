import { ChangeEvent } from "react";
import { Input as InputElement } from "@nextui-org/react";

interface Props {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export function Input({
  name,
  value,
  placeholder,
  label,
  onChange,
  required,
}: Props) {
  return (
    <div>
      <InputElement
        name={name}
        value={value}
        label={label}
        placeholder={placeholder}
        onChange={(evt: ChangeEvent<HTMLInputElement>) =>
          onChange(evt.target.value)
        }
        fullWidth
        required={required}
      />
    </div>
  );
}
