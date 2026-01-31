import { TextField as TextFieldPrimitive } from "@radix-ui/themes"

type TextFieldProps = TextFieldPrimitive.RootProps & React.RefAttributes<HTMLInputElement>;

export const TextField = (props: TextFieldProps) => {
  return (
    <TextFieldPrimitive.Root {...props} />
  )
}