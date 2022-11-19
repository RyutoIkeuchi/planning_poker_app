import "twin.macro";

import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useState } from "react";
import { EnterRoomIcon } from "src/components/Icon/EnterRoomIcon";
import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";

const EnterRoom = () => {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  const handleEnterTheRoom = useCallback(async () => {
    const response = await api.post(`/pokers/${roomId}/users`);
    if (response.status == 200) {
      const convertObj = toLowerCamelCaseObj(response.data);
      const addColumnToConvertObj: Required<ToLocalStorageUserType> = {
        ...convertObj,
        selectedNumberCard: "",
      };
      localStorage.setItem("ROOM_DATA", JSON.stringify(addColumnToConvertObj));
      router.push(`/poker-room/${roomId}`);
    }
  }, [router, roomId]);

  const handleChangeRoomId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  }, []);

  return (
    <div tw="flex items-center justify-center flex-col max-w-xl mx-auto min-h-screen">
      <div tw="mb-10">
        <EnterRoomIcon />
      </div>
      <div tw="w-full mb-4">
        <input
          type="text"
          onChange={handleChangeRoomId}
          tw="border w-full p-4"
          placeholder="ルームID"
          data-testid="input-roomid"
          value={roomId}
        />
      </div>
      <div tw="w-full">
        <button
          onClick={handleEnterTheRoom}
          tw="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          部屋に入る
        </button>
      </div>
    </div>
  );
};

export default EnterRoom;
