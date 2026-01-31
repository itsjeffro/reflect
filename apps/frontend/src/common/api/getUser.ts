import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useHttpClient } from '../hooks/useHttpClient';
import { throwError } from './helpers';
import type { UserModel } from './types/user.types';

type GetUserError = {
  code: number;
};

type Response = UserModel;

export const useGetUser = () => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, GetUserError>({
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
