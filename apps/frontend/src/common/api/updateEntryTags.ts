import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { throwError, type ValidationError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';
import type { EntryModel } from './types/entry.types';

type Error = {
  response: ValidationError;
};

type Request = {
  id: string | number;
  payload: {
    tags: string[];
  };
}

type Response = EntryModel;

export const useUpdateEntryTags = (mutate?: Partial<UseMutationOptions<Response, Error, Request>>) => {
  const { httpClient } = useHttpClient();

  return useMutation<Response, Error, Request>({
    ...mutate,
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await httpClient.put(`/api/entries/${id}/tags`, payload);

        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
  });
};
