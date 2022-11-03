import { useCallback } from "react";
import { api } from "src/service/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const usePokerRoom = (roomId: string) => {
  const { data, error, mutate } = useSWR(() => `/pokers/${roomId}`, fetcher, {
    refreshInterval: 1000,
  });

  const reload = useCallback(() => {
    console.log("再取得");
    mutate();
  }, [mutate]);

  return {
    data,
    isError: error,
    isLoading: !error && !data,
    reload,
  };
};
