import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { PokerType } from "src/types";
import useSWR from "swr";

const fetcher = (url: string) =>
  api.get(url).then((res): PokerType => {
    const convertToData = res.data.users.map((res) => {
      const convertObj = toLowerCamelCaseObj(res);
      return {
        ...convertObj,
        isSelected: res.selected_number_card !== "",
      };
    });

    return {
      id: res.data.id,
      agendaTitle: res.data.agenda_title,
      pokerStatus: res.data.poker_status,
      roomId: res.data.room_id,
      users: convertToData,
    };
  });

export const usePokerRoom = (roomId: string) => {
  const { data, error, mutate } = useSWR<PokerType, Error>(() => `/pokers/${roomId}`, fetcher, {
    refreshInterval: 1000,
  });

  return {
    isError: error,
    isLoading: !error && !data,
    mutate,
    roomData: data,
  };
};
