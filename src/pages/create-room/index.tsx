import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useState } from "react";
import { CreateRoomIcon } from "src/components/Icon/CreateRoomIcon";
import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";

const CreateRoom = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const handleCreateRoomId = useCallback(async () => {
    const data = {
      host_user: true,
      user_name: userName,
    };
    const response = await api.post("/pokers", data);
    if (response.status == 200) {
      const convertObj = toLowerCamelCaseObj(response.data);
      const addColumnToConvertObj: Required<ToLocalStorageUserType> = {
        ...convertObj,
        selectedNumberCard: "",
      };
      localStorage.setItem("ROOM_DATA", JSON.stringify(addColumnToConvertObj));
      router.push(`/poker-room/${response.data.room_id}`);
    }
  }, [userName, router]);

  const handleChangeUserName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }, []);

  return (
    <div className="flex items-center justify-center flex-col max-w-xl mx-auto min-h-screen">
      <div className="mb-10">
        <CreateRoomIcon />
      </div>
      <div className="w-full mb-10">
        <input
          type="text"
          onChange={handleChangeUserName}
          className="border w-full p-4"
          placeholder="ユーザー名"
        />
      </div>
      <div className="w-full">
        <button
          onClick={handleCreateRoomId}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
        >
          部屋を作る
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
