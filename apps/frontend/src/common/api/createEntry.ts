import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { throwError, type ValidationError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';
import { timezone } from '../utils/date';
import type { EntryRequest, EntryModel } from './types/entry.types';

type Error = {
  response: ValidationError;
};

type Request = EntryRequest;

type Response = EntryModel;

export const useCreateEntry = (mutate?: Partial<UseMutationOptions<Response, Error, Request>>) => {
  const { httpClient } = useHttpClient();

  return useMutation<Response, Error, Request>({
    ...mutate,
    mutationFn: async (data) => {
      try {
        const response = await httpClient.post('/api/entries', data, {
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
