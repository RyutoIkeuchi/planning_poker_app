import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Key } from "react";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { UserType } from "src/types";

type Props = {
  isSelectedNumberCardResult: boolean;
  myUserName: string;
  roomId: string;
};

export const RoomUserCardList = (props: Props) => {
  const { isSelectedNumberCardResult, myUserName, roomId } = props;
  const { roomData } = usePokerRoom(roomId);

  return (
    <ul className="flex justify-start min-h-[500px]">
      {roomData.users.map((user: UserType, index: Key) => {
        return (
          <li
            key={index}
            className={`w-28 h-40 mr-10 ${user.userName === myUserName && "text-red-600"}`}
          >
            <div className="w-full h-full border border-blue-600 shadow-lg">
              <div className="h-1/2 flex items-center justify-center">
                <p className="text-3xl">
                  {isSelectedNumberCardResult
                    ? user.selectedNumberCard
                    : user.isSelected
                    ? "済"
                    : "未"}
                </p>
              </div>
              <hr />
              <div className="h-1/2 flex items-center justify-center">
                <div className="w-[40px] h-[40px] relative">
                  <Image
                    src={`https://joeschmoe.io/api/v1/${user.userName}`}
                    layout="fill"
                    objectFit="contain"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {user.hostUser && <FontAwesomeIcon icon={faUserTie} />}
              <p className="text-center ml-1">{user.userName}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
