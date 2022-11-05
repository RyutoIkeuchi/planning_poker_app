import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Key, useCallback } from "react";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { UserType } from "src/types";
import tw from "twin.macro";

type Props = {
  myUserName: string;
  roomId: string;
};

export const RoomUserCardList = (props: Props) => {
  const { myUserName, roomId } = props;
  const { roomData } = usePokerRoom(roomId);

  const selectedStatus = useCallback((isSelected: boolean) => {
    if (isSelected) {
      return "済";
    }
    return "未";
  }, []);

  return (
    <ul tw="flex justify-start min-h-[500px]">
      {roomData.users.map((user: UserType, index: Key) => {
        return (
          <li
            key={index}
            css={user.userName === myUserName && tw`text-red-600`}
            tw="w-28 h-40 mr-10"
          >
            <div tw="w-full h-full border border-blue-600 shadow-lg">
              <div tw="h-1/2 flex items-center justify-center">
                <p tw="text-3xl">
                  {roomData.pokerStatus === "result"
                    ? user.selectedNumberCard
                    : selectedStatus(user.isSelected)}
                </p>
              </div>
              <hr />
              <div tw="h-1/2 flex items-center justify-center">
                <div tw="w-[40px] h-[40px] relative">
                  <Image
                    src={`https://joeschmoe.io/api/v1/${user.userName}`}
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div tw="flex justify-center items-center">
              {user.hostUser && <FontAwesomeIcon icon={faUserTie} />}
              <p tw="text-center ml-1">{user.userName}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
