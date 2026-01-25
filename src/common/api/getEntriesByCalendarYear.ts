import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "../hooks/useHttpClient";
import { timezone } from "../utils/date";

type Response = {
  [key: string]: { count: number };
}

export const useGetEntriesByCalendarYear = ({ year }: { year: number | string }) => {
  const { httpClient } = useHttpClient();

  return useQuery<Response, Error>({
    queryKey: ['entries', year],
    queryFn: async () => {
      return httpClient
        .get(`/api/calendar-entries/${year}`, {
          headers: {
            'Time-Zone': timezone(),
          }
        })
        .then((response) => response.data);
    },
  });
};
