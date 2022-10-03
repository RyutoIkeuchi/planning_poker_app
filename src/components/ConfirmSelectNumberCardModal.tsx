import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Socket } from "socket.io-client";
import { api } from "src/service/api";

type Props = {
  roomId: string;
  selectCard: string;
  setCanSelectNumberCard: Dispatch<SetStateAction<boolean>>;
  setIsConfirmModal: Dispatch<SetStateAction<boolean>>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  userId: number;
  userName: string;
};

export const ConfirmSelectNumberCardModal = (props: Props) => {
  const {
    roomId,
    selectCard,
    setCanSelectNumberCard,
    setIsConfirmModal,
    socket,
    userId,
    userName,
  } = props;

  const handleSubmitSelectNumber = useCallback(async () => {
    socket.emit("send_select_number", {
      room_id: roomId,
      select_card: selectCard,
      user_name: userName,
    });

    const data = {
      select_number_card: selectCard,
    };

    await api.put(`/pokers/${roomId}/users/${userId}`, data);
    setIsConfirmModal(false);
    setCanSelectNumberCard(false);
  }, [socket, roomId, selectCard, userName, userId, setIsConfirmModal, setCanSelectNumberCard]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModal(false);
  }, [setIsConfirmModal]);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-64 bg-white outline-none focus:outline-none h-96">
            <div className="flex justify-between items-center py-1 px-2 border-b">
              <button onClick={handleCloseConfirmModal}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <button
                className="text-blue-600 font-bold text-sm hover:text-blue-400 p-2"
                type="button"
                onClick={handleSubmitSelectNumber}
              >
                送信する
              </button>
            </div>
            <div className="mx-auto h-full flex items-center">
              <p className="text-6xl">{selectCard}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
