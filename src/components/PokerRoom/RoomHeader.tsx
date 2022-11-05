import { faPaperclip, faRightFromBracket, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";
import { api } from "src/service/api";

type Props = {
  isHostUser: boolean;
  roomId: string;
  userId: number;
};

export const RoomHeader = (props: Props) => {
  const { isHostUser, roomId, userId } = props;
  const [isCopiedText, setIsCopiedText] = useState<boolean>(false);
  const router = useRouter();

  const handleCopyRoomId = useCallback(() => {
    navigator.clipboard.writeText(roomId);
    setIsCopiedText(true);
    setTimeout(() => {
      setIsCopiedText(false);
    }, 2000);
  }, [roomId]);

  const handleLeaveTheRoom = useCallback(async () => {
    localStorage.removeItem("ROOM_DATA");
    if (isHostUser) {
      await api.delete(`/pokers/${roomId}`);
    } else {
      await api.delete(`/pokers/${roomId}/users/${userId}`);
    }
    router.push("/");
  }, []);

  return (
    <div className="my-6 flex justify-between items-center">
      <div className="flex items-center justify-start">
        <h2 className="mr-2">
          Room ID : <span className="font-bold text-xl">{roomId}</span>
        </h2>
        <button onClick={handleCopyRoomId}>
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <div
          className={`bg-white border p-2 rounded shadow-md ml-4 flex items-center justify-center ${
            isCopiedText ? "block" : "hidden"
          } `}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="text-yellow-500 mr-2" />
          <p className="text-sm">copied!</p>
        </div>
      </div>
      <PrimaryButton
        buttonColor="bg-red-500"
        hoverButtonColor="hover:bg-red-700"
        handleClickMethod={handleLeaveTheRoom}
        disabled={false}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span className="ml-2">部屋を退出する</span>
      </PrimaryButton>
    </div>
  );
};
