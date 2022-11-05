import { useCallback, useMemo } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { api } from "src/service/api";
import tw from "twin.macro";

type Props = {
  roomId: string;
};

export const ResultAndAgainButton = (props: Props) => {
  const { roomId } = props;
  const { mutate, roomData } = usePokerRoom(roomId);

  const isResultAndAgainButtonDisabled = useMemo(() => {
    const allRoomUserIsSelected = roomData.users.every((user) => user.isSelected);
    if (allRoomUserIsSelected) {
      return false;
    }
    return true;
  }, [roomData]);

  const handleAgainSelectedNumberCard = useCallback(async () => {
    const data = {
      poker_status: "reset",
    };
    await api.put(`/pokers/${roomId}`, data);
    await api.put(`/pokers/${roomId}/users/`);
    await mutate((prevRoomData) => {
      const updateUsers = prevRoomData.users.map((user) => {
        return {
          ...user,
          selectedNumberCard: "",
        };
      });
      return {
        ...prevRoomData,
        users: updateUsers,
      };
    });
  }, [roomId, mutate]);

  const handleResultSelectedNumberCard = useCallback(async () => {
    const data = {
      poker_status: "result",
    };
    await api.put(`/pokers/${roomId}`, data);
    await mutate((data) => {
      return {
        ...data,
        pokerStatus: "result",
      };
    });
  }, [roomId, mutate]);

  return (
    <div tw="flex justify-start">
      <div tw="mr-4">
        <PrimaryButton
          buttonColor="bg-blue-500"
          hoverButtonColor="hover:bg-blue-700"
          handleClickMethod={handleResultSelectedNumberCard}
          disabled={isResultAndAgainButtonDisabled}
        >
          結果を見る
        </PrimaryButton>
      </div>
      <div>
        <PrimaryButton
          buttonColor="bg-gray-500"
          hoverButtonColor="hover:bg-gray-700"
          handleClickMethod={handleAgainSelectedNumberCard}
          disabled={isResultAndAgainButtonDisabled}
        >
          もう一度
        </PrimaryButton>
      </div>
    </div>
  );
};
