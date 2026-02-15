import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import type { TagModel } from "./types/tag.types";

type Response = TagModel[];

export const useGetTags = () => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    queryKey: ['tags'],
    queryFn: () => httpClient.get('/api/tags').then(response => response.data)
  });
};
