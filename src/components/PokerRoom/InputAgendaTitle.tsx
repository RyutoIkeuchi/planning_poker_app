import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";

export type InputAgendaTitleProps = {
  agendaTitle: string;
  canChangeAgendaTitle: boolean;
  handleCancelAgendaTitle: () => void;
  handleSubmitAgendaTitle: () => void;
  isCancelAgendaTitleDisabled: boolean;
  isSubmitAgendaTitleDisabled: boolean;
  setAgendaTitle: Dispatch<SetStateAction<string>>;
  setIsSubmitAgendaTitleDisabled: Dispatch<SetStateAction<boolean>>;
};

export const InputAgendaTitle = (props: InputAgendaTitleProps) => {
  const {
    agendaTitle,
    canChangeAgendaTitle,
    handleCancelAgendaTitle,
    handleSubmitAgendaTitle,
    isCancelAgendaTitleDisabled,
    isSubmitAgendaTitleDisabled,
    setAgendaTitle,
    setIsSubmitAgendaTitleDisabled,
  } = props;

  const handleChangeAgendaTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputAgendaTitle = e.target.value;
    setAgendaTitle(inputAgendaTitle);
    if (inputAgendaTitle !== "") {
      setIsSubmitAgendaTitleDisabled(false);
    } else {
      setIsSubmitAgendaTitleDisabled(true);
    }
  }, []);

  return (
    <div className="flex justify-start items-center w-2/3">
      <div className="mr-4 w-1/2">
        <input
          type="text"
          value={agendaTitle}
          className="border p-2 w-full rounded"
          onChange={handleChangeAgendaTitle}
          disabled={!canChangeAgendaTitle}
          placeholder="議題を入力"
        />
      </div>
      <div className="mr-4">
        <PrimaryButton
          buttonColor="bg-green-500"
          hoverButtonColor="hover:bg-green-700"
          handleClickMethod={handleSubmitAgendaTitle}
          disabled={isSubmitAgendaTitleDisabled}
        >
          決定
        </PrimaryButton>
      </div>
      <PrimaryButton
        buttonColor="bg-orange-500"
        hoverButtonColor="hover:bg-orange-700"
        handleClickMethod={handleCancelAgendaTitle}
        disabled={isCancelAgendaTitleDisabled}
      >
        取り消し
      </PrimaryButton>
    </div>
  );
};
