import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import type { EntryModel } from "./types/entry.types";
import { timezone } from "../utils/date";

type Response = EntryModel[];

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
          params,
          headers: {
            'Time-Zone': timezone(),
          }
        })
        .then((response) => response.data);
    },
    enabled: !!params?.published_at
  });
};
