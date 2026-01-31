import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import type { EntryModel } from "./types/entry.types";

type Response = EntryModel;

export const useGetEntryById = ({ id }: { id: string | number }) => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    queryKey: ['entries', id],
    queryFn: () => {
      return httpClient.get(`/api/entries/${id}`).then((response) => response.data);
    },
  });
};
