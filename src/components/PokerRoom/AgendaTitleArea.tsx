import { InputAgendaTitle } from "src/components/PokerRoom/InputAgendaTitle";
import { ResultAndAgainButton } from "src/components/PokerRoom/ResultAndAgainButton";
import { usePokerRoom } from "src/hooks/usePokerRoom";

type Props = { isHostUser: boolean; roomId: string };

export const AgendaTitleArea = (props: Props) => {
  const { isHostUser, roomId } = props;
  const { roomData } = usePokerRoom(roomId);

  return (
    <div className="py-4 mb-4">
      <div className="bg-gray-300 px-2 py-4">
        {isHostUser ? (
          <div className="flex justify-between items-center">
            <InputAgendaTitle roomId={roomId} />
            <ResultAndAgainButton roomId={roomId} />
          </div>
        ) : (
          <h3 className="text-2xl text-center">
            議題：{roomData.agendaTitle !== "" ? roomData.agendaTitle : "未設定"}
          </h3>
        )}
      </div>
    </div>
  );
};
