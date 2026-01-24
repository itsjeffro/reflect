import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { throwError, type ValidationError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';
import { timezone } from '../utils/date';
import type { EntryRequest, EntryResponse } from './types/entry.types';

type Error = {
  response: ValidationError;
};

type Request = {
  id: string | number;
  payload: EntryRequest;
}

type Response = EntryResponse;

export const useUpdateEntryById = (mutate?: Partial<UseMutationOptions<Response, Error, Request>>) => {
  const { httpClient } = useHttpClient();

  return useMutation<Response, Error, Request>({
    ...mutate,
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await httpClient.put(`/api/entries/${id}`, payload, {
          headers: {
            'Time-Zone': timezone(),
          },
        });

        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
  });
};
