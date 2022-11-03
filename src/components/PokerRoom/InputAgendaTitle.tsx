import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { api } from "src/service/api";

type Props = {
  roomId: string;
};

export const InputAgendaTitle = (props: Props) => {
  const { roomId } = props;
  const { roomData } = usePokerRoom(roomId);
  const [agendaTitle, setAgendaTitle] = useState<string>(roomData.agendaTitle);

  const memoIsSubmitAgendaTitleDisabled = useMemo(() => {
    if (roomData && roomData.agendaTitle !== "") {
      return true;
    }
    return false;
  }, [roomData]);

  const memoCanChangeAgendaTitle = useMemo(() => {
    if (roomData && roomData.agendaTitle !== "") {
      return false;
    }
    return true;
  }, [roomData]);

  const memoIsCancelAgendaTitleDisabled = useMemo(() => {
    if ((roomData && roomData.agendaTitle !== "") || agendaTitle !== "") {
      return false;
    }
    return true;
  }, [roomData]);

  const handleChangeAgendaTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputAgendaTitle = e.target.value;
    setAgendaTitle(inputAgendaTitle);
  }, []);

  const handleSubmitAgendaTitle = useCallback(async () => {
    const data = {
      agenda_title: agendaTitle,
    };
    await api.put(`/pokers/${roomId}`, data);
  }, [agendaTitle, roomId]);

  const handleCancelAgendaTitle = useCallback(async () => {
    setAgendaTitle("");
    const data = {
      agenda_title: "",
    };
    await api.put(`/pokers/${roomId}`, data);
    await api.put(`/pokers/${roomId}/users`);
  }, [roomId]);

  return (
    <div className="flex justify-start items-center w-2/3">
      <div className="mr-4 w-1/2">
        <input
          type="text"
          value={agendaTitle}
          className="border p-2 w-full rounded"
          onChange={handleChangeAgendaTitle}
          disabled={!memoCanChangeAgendaTitle}
          placeholder="議題を入力"
        />
      </div>
      <div className="mr-4">
        <PrimaryButton
          buttonColor="bg-green-500"
          hoverButtonColor="hover:bg-green-700"
          handleClickMethod={handleSubmitAgendaTitle}
          disabled={memoIsSubmitAgendaTitleDisabled}
        >
          決定
        </PrimaryButton>
      </div>
      <PrimaryButton
        buttonColor="bg-orange-500"
        hoverButtonColor="hover:bg-orange-700"
        handleClickMethod={handleCancelAgendaTitle}
        disabled={memoIsCancelAgendaTitleDisabled}
      >
        取り消し
      </PrimaryButton>
    </div>
  );
};
