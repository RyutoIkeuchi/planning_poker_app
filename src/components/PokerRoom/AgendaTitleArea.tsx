import "twin.macro";

import { InputAgendaTitle } from "src/components/PokerRoom/InputAgendaTitle";
import { ResultAndAgainButton } from "src/components/PokerRoom/ResultAndAgainButton";
import { usePokerRoom } from "src/hooks/usePokerRoom";

type Props = { isHostUser: boolean; roomId: string };

export const AgendaTitleArea = (props: Props) => {
  const { isHostUser, roomId } = props;
  const { roomData } = usePokerRoom(roomId);

  return (
    <div tw="py-4 mb-4">
      <div tw="bg-gray-300 px-2 py-4">
        {isHostUser ? (
          <div tw="flex justify-between items-center">
            <InputAgendaTitle roomId={roomId} />
            <ResultAndAgainButton roomId={roomId} />
          </div>
        ) : (
          <h3 tw="text-2xl text-center" data-testid="test-agenda-title">
            議題：{roomData.agendaTitle !== "" ? roomData.agendaTitle : "未設定"}
          </h3>
        )}
      </div>
    </div>
  );
};
