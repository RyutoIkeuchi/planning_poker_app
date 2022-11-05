import "twin.macro";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { api } from "src/service/api";

type Props = {
  roomId: string;
};

export const InputAgendaTitle = (props: Props) => {
  const { roomId } = props;
  const { mutate, roomData } = usePokerRoom(roomId);
  const [inputAgendaTitle, setInputAgendaTitle] = useState<string>(roomData.agendaTitle);

  const isSubmitButtonDisabled = useMemo(() => {
    if ((roomData && roomData.agendaTitle !== "") || inputAgendaTitle === "") {
      return true;
    }
    return false;
  }, [roomData, inputAgendaTitle]);

  const canChangeInputAgendaTitle = useMemo(() => {
    if (roomData && roomData.agendaTitle !== "") {
      return false;
    }
    return true;
  }, [roomData]);

  const isCancelButtonDisabled = useMemo(() => {
    if (roomData && roomData.agendaTitle === "") {
      return true;
    }
    return false;
  }, [roomData]);

  const handleChangeAgendaTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setInputAgendaTitle(inputText);
  }, []);

  const handleSubmitAgendaTitle = useCallback(async () => {
    const data = {
      agenda_title: inputAgendaTitle,
    };
    await api.put(`/pokers/${roomId}`, data);
    await mutate((data) => {
      return {
        ...data,
        agendaTitle: inputAgendaTitle,
      };
    });
  }, [inputAgendaTitle, roomId, mutate]);

  const handleCancelAgendaTitle = useCallback(async () => {
    setInputAgendaTitle("");
    const data = {
      agenda_title: "",
    };
    await api.put(`/pokers/${roomId}`, data);
    await api.put(`/pokers/${roomId}/users`);
    await mutate((data) => {
      return {
        ...data,
        agendaTitle: "",
      };
    });
  }, [roomId, mutate]);

  return (
    <div tw="flex justify-start items-center w-2/3">
      <div tw="mr-4 w-1/2">
        <input
          type="text"
          value={inputAgendaTitle}
          tw="border p-2 w-full rounded"
          onChange={handleChangeAgendaTitle}
          disabled={!canChangeInputAgendaTitle}
          placeholder="議題を入力"
        />
      </div>
      <div tw="mr-4">
        <PrimaryButton
          buttonColor="bg-green-500"
          hoverButtonColor="hover:bg-green-700"
          handleClickMethod={handleSubmitAgendaTitle}
          disabled={isSubmitButtonDisabled}
        >
          決定
        </PrimaryButton>
      </div>
      <PrimaryButton
        buttonColor="bg-orange-500"
        hoverButtonColor="hover:bg-orange-700"
        handleClickMethod={handleCancelAgendaTitle}
        disabled={isCancelButtonDisabled}
      >
        取り消し
      </PrimaryButton>
    </div>
  );
};
