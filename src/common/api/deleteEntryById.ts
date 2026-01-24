import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { throwError, type ValidationError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';
import { timezone } from '../utils/date';

type Error = {
  response: ValidationError;
};

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
