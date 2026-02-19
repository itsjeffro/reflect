import { Button, Dialog, Flex, type ButtonProps } from "@radix-ui/themes"
import type { ReactNode } from "react";

type Action = ButtonProps & {
  label: string;
  onClick: () => void;
};

type ModalProps = Dialog.RootProps & {
  title: string;
  children?: ReactNode;
  actions?: Action[];
};

export const Modal = ({ title, children, actions, ...props }: ModalProps) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>

        <Flex direction="column" gap="4">
          {children}

          <Flex justify="end" gap="2">
            {actions?.map((action) => (
              <Button {...action} onClick={action.onClick}>{action.label}</Button>
            ))}
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
};
