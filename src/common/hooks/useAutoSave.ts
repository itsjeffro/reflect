import { useEffect, useRef } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"

type AutoSaveProps<T extends FieldValues> = {
  delay?: number
  form: UseFormReturn<T>
  onSave: (data: T) => void | Promise<void>
}

export function useAutoSave<T extends FieldValues>({ delay = 1000, form, onSave }: AutoSaveProps<T>) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const subscription = form.watch(() => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        const { isDirty, dirtyFields } = form.formState

        const hasNoChanges = !isDirty || Object.keys(dirtyFields).length === 0

        if (hasNoChanges) {
          return
        }

        onSave(form.getValues())
      }, delay)
    })

    return () => {
      subscription.unsubscribe();

      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [
    delay,
    onSave,
    form,
    form.formState.isDirty,
    form.formState.dirtyFields,
  ])
};
