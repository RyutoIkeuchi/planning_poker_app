import { InputAgendaTitle, InputAgendaTitleProps } from "src/components/PokerRoom/AgendaTitle";
import {
  ResultAndAgainButton,
  ResultAndAgainButtonProps,
} from "src/components/PokerRoom/ResultAndAgainButton";

type Props = ResultAndAgainButtonProps & InputAgendaTitleProps & { isHostUser: boolean };

export const AgendaTitleArea = (props: Props) => {
  const { agendaTitle, isHostUser } = props;

  return (
    <div className="py-4 mb-4">
      {isHostUser ? (
        <div className="flex justify-between items-center bg-gray-300 px-2 py-4">
          <InputAgendaTitle {...props} />
          <ResultAndAgainButton {...props} />
        </div>
      ) : (
        <div className="px-2 py-4 bg-gray-300">
          <h3 className="text-2xl text-center">
            議題：{agendaTitle !== "" ? agendaTitle : "未設定"}
          </h3>
        </div>
      )}
    </div>
  );
};
