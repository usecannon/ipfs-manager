import { ChangeEvent } from "react";
import { Textarea as TextareaElement } from "@nextui-org/react";

interface Props {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export function Textarea({
  name,
  value,
  placeholder,
  label,
  onChange,
  required,
}: Props) {
  return (
    <div>
      <TextareaElement
        name={name}
        value={value}
        label={label}
        placeholder={placeholder}
        onChange={(evt: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(evt.target.value)
        }
        required={required}
        fullWidth
      />
    </div>
  );
}
