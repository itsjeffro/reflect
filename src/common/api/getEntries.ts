import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import type { EntryResponse } from "./types/entry.types";

type Response = EntryResponse[];

type Params = {
  published_at?: string | null;
}

export const useGetEntries = (params: Params) => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    queryKey: ['entries', ...Object.values(params)],
    queryFn: () => {
      return httpClient
        .get('/api/entries', {
          params
        })
        .then((response) => response.data);
    },
    enabled: !!params?.published_at
  });
};
