import { InputAgendaTitle, InputAgendaTitleProps } from "src/components/PokerRoom/InputAgendaTitle";
import {
  ResultAndAgainButton,
  ResultAndAgainButtonProps,
} from "src/components/PokerRoom/ResultAndAgainButton";

type Props = ResultAndAgainButtonProps & InputAgendaTitleProps & { isHostUser: boolean };

export const AgendaTitleArea = (props: Props) => {
  const { agendaTitle, isHostUser } = props;

  return (
    <div className="py-4 mb-4">
      <div className="bg-gray-300 px-2 py-4">
        {isHostUser ? (
          <div className="flex justify-between items-center">
            <InputAgendaTitle {...props} />
            <ResultAndAgainButton {...props} />
          </div>
        ) : (
          <h3 className="text-2xl text-center">
            議題：{agendaTitle !== "" ? agendaTitle : "未設定"}
          </h3>
        )}
      </div>
    </div>
  );
};
