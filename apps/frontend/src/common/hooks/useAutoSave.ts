import { useDeepCompareEffect } from "ahooks"
import { useWatch, type DeepPartialSkipArrayKey, type FieldValues, type UseFormReturn } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"

type AutoSaveProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSave: (data: T) => void | Promise<void>
  defaultValues?: DeepPartialSkipArrayKey<T>;
  delay?: number
}

export function useAutoSave<T extends FieldValues>({ defaultValues, form, onSave, delay = 1000 }: AutoSaveProps<T>) {
  const watchedData = useWatch({
    control: form.control,
    defaultValue: defaultValues,
  });

  const debounce = useDebouncedCallback(() => {
    form.handleSubmit(onSave)();
  }, delay);

  useDeepCompareEffect(() => {
    if (form.formState.isDirty) {
      debounce();
    }
  }, [watchedData, form]);
};
