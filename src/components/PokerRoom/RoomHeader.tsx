import { faPaperclip, faRightFromBracket, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import router, { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { PrimaryButton } from "src/components/Common/PrimaryButton";
import { api } from "src/service/api";
import "twin.macro";

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
    <div tw="py-6 flex justify-between items-center">
      <div tw="flex items-center justify-start">
        <h2 tw="mr-2 text-xl">
          Room ID :{" "}
          <span tw="font-bold text-xl" data-testid="header-room-id">
            {roomId}
          </span>
        </h2>
        <button onClick={handleCopyRoomId} data-testid="copy-room-id">
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <div
          tw="bg-white border p-2 rounded shadow-md ml-4"
          className={`${isCopiedText ? "block" : "hidden"} flex items-center justify-center`}
          data-testid="copied-label"
        >
          <FontAwesomeIcon icon={faThumbsUp} tw="text-yellow-500 mr-2" />
          <p tw="text-sm">copied!</p>
        </div>
      </div>
      <PrimaryButton
        buttonColor="bg-red-500"
        hoverButtonColor="hover:bg-red-700"
        handleClickMethod={handleLeaveTheRoom}
        disabled={false}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span tw="ml-2">部屋を退出する</span>
      </PrimaryButton>
    </div>
  );
};
