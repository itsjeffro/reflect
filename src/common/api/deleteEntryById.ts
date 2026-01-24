import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { throwError, type ValidationError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';

type Error = {
  response: ValidationError;
};

type Request = {
  id: number | string;
}

export const useDeleteEntryById = (mutate?: Partial<UseMutationOptions<Response, Error, Request>>) => {
  const { httpClient } = useHttpClient();

  return useMutation<Response, Error, Request>({
    ...mutate,
    mutationFn: async ({ id }) => {
      try {
        const response = await httpClient.delete(`/api/entries/${id}`);

        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
  });
};
