import "twin.macro";

import { faCheckCircle, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { LoadingCircle } from "../Common/LoadingCircle";

type CreateRoomStatusProps = {
  canNavigate: boolean;
  isLoading: boolean;
  roomId: string;
};

export const CreateRoomStatus = (props: CreateRoomStatusProps) => {
  const { canNavigate, isLoading, roomId } = props;

  if (!canNavigate) {
    return <p tw="text-2xl font-bold text-center">もう少々お待ちください...</p>;
  }

  if (canNavigate && isLoading) {
    return <LoadingCircle />;
  }

  return (
    <div>
      <div tw="flex items-center justify-center mb-6">
        <FontAwesomeIcon icon={faCheckCircle} size="7x" tw="text-blue-400" />
      </div>
      <div tw="flex items-center justify-center">
        <p tw="text-2xl text-center mb-4 font-bold">部屋が作成されました！</p>
      </div>
      <Link href={`/poker-room/${roomId}`}>
        <div tw="flex items-center justify-center">
          <button tw="text-2xl text-center underline flex items-center justify-center">
            <p tw="mr-2">遷移する</p>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </button>
        </div>
      </Link>
    </div>
  );
};
