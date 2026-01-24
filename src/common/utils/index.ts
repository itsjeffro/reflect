import { type Ref, type RefCallback, type RefObject } from 'react';

export const range = (from: number, to: number) => {
  const numbers = [];

  for (let i = from; i <= to; i++) {
    numbers.push(i);
  }

  return numbers;
};

export const mergeRefs = <T>(refs: (Ref<T> | undefined)[]): RefCallback<T> => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        return ref(value);
      }

      if (ref) {
        return ((ref as RefObject<T | null>).current = value);
      }
    });
  };
};
