import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import { throwError } from "./helpers";

export const useAuthLogout = (mutate?: Partial<UseMutationOptions<Response, Error>>) => {
  const { httpClient } = useHttpClient();

  return useMutation<Response, Error>({
    ...mutate,
    mutationFn: async () => {
      try {
        const response = await httpClient.delete(`/logout`);

        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
  });
};
