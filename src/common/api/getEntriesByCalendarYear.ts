import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";

type Response = {
  [key: string]: { count: number };
}

export const useGetEntriesByCalendarYear = ({ year }: { year: number | string }) => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    queryKey: ['entries', year],
    queryFn: async () => {
      return httpClient.get(`/api/calendar-entries/${year}`).then((response) => response.data);
    },
  });
};
