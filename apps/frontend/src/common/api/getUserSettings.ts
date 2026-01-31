import { useQuery } from '@tanstack/react-query';
import { throwError } from './helpers';
import { useHttpClient } from '../hooks/useHttpClient';
import type { SettingsModel } from './types/settings.types';

type Error = {
  message: string;
  errors: string[];
  code: number;
};

type GetSettingsByGroupType = {
  onSuccess?: (response: SettingsModel) => void;
};

export const useGetUserSettings = ({ onSuccess }: GetSettingsByGroupType = {}) => {
  const { httpClient } = useHttpClient();

  return useQuery<SettingsModel, Error>({
    queryKey: ['user-settings'],
    queryFn: async () => {
      try {
        const response = await httpClient.get(`/api/user/settings`);

        if (response.status >= 200 && response.status < 300 && onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
  });
};
