import { useCallback } from "react";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { UserType } from "src/types";

type Props = {
  roomId: string;
};

export const SprintPointArea = (props: Props) => {
  const { roomId } = props;
  const { roomData } = usePokerRoom(roomId);

  // 部屋に入るユーザーの選択したカードの平均値を割り出す
  const calculateAverage = useCallback(() => {
    const filterNotSelectUserList = roomData.users.filter((user) => {
      if (user.selectedNumberCard !== "/") {
        return user;
      }
    });
    const total: number = filterNotSelectUserList.reduce(
      (acc, cur: UserType) => acc + Number(cur.selectedNumberCard),
      0,
    );
    const average = total / filterNotSelectUserList.length;
    return average.toString();
  }, [roomData]);

  return (
    <div className="mb-10 border-b border-gray-500">
      <div className="text-center pt-10 pb-20">
        <div className="mb-6">
          <p className="text-xl">スプリントポイント</p>
        </div>
        <p className="text-8xl font-bold">
          {roomData.pokerStatus === "result" ? calculateAverage() : "?"}
        </p>
      </div>
    </div>
  );
};
