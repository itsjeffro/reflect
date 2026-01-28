import { useEffect } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"

type AutoSaveProps<T extends FieldValues> = {
  delay?: number
  form: UseFormReturn<T>
  onSave: (data: T) => void | Promise<void>
}

export function useAutoSave<T extends FieldValues>({ delay = 1000, form, onSave }: AutoSaveProps<T>) {
  const {watch, formState: {isDirty, dirtyFields }} = form;

  const debounce = useDebouncedCallback(async (values) => {
    onSave(values)
  }, delay);

  useEffect(() => {
    const subscription = watch((values) => {
      if (isDirty || Object.keys(dirtyFields).length > 0) {
        debounce(values);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDirty, watch, debounce, dirtyFields]);
};
