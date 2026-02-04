import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useHttpClient } from '../hooks/useHttpClient';
import { throwError } from './helpers';
import type { UserModel } from './types/user.types';

type Error = {
  code: number;
};

type Response = UserModel;

export const useGetUser = (options: Partial<UseQueryOptions<Response, Error>>) => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    ...options,
    queryKey: ['user'],
    retry: 0,
    queryFn: async () => {
      try {
        const response = await httpClient.get(`/api/user`);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throwError(error);
        }

        throw new AxiosError('Oops! Something went wrong.');
      }
    },
  });
};
