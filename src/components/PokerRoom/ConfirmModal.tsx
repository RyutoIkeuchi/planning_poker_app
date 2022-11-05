import "twin.macro";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useCallback } from "react";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { api } from "src/service/api";

type Props = {
  roomId: string;
  selectNumberCard: string;
  setIsConfirmModal: Dispatch<SetStateAction<boolean>>;
  userId: number;
  userName: string;
};

export const ConfirmModal = (props: Props) => {
  const { roomId, selectNumberCard, setIsConfirmModal, userId } = props;
  const { mutate } = usePokerRoom(roomId);

  const handleSubmitSelectNumberCard = useCallback(async () => {
    const data = {
      selected_number_card: selectNumberCard,
    };

    await api.put(`/pokers/${roomId}/users/${userId}`, data);
    await mutate((prevRoomData) => {
      const updateUsers = prevRoomData.users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            selectedNumberCard: selectNumberCard,
          };
        }
        return user;
      });
      return {
        ...prevRoomData,
        users: updateUsers,
      };
    });
    setIsConfirmModal(false);
  }, [roomId, selectNumberCard, userId, setIsConfirmModal, mutate]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModal(false);
  }, [setIsConfirmModal]);

  return (
    <>
      <div tw="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div tw="relative w-auto my-6 max-w-3xl">
          <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-64 bg-white outline-none focus:outline-none h-96">
            <div tw="flex justify-between items-center py-1 px-2 border-b">
              <button onClick={handleCloseConfirmModal}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <button
                tw="text-blue-600 font-bold text-sm hover:text-blue-400 p-2"
                type="button"
                onClick={handleSubmitSelectNumberCard}
              >
                送信する
              </button>
            </div>
            <div tw="mx-auto h-full flex items-center">
              <p tw="text-6xl">{selectNumberCard}</p>
            </div>
          </div>
        </div>
      </div>
      <div tw="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
