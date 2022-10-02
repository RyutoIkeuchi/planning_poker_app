import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import CreateRoomIcon from "public/images/CreateRoom_Flatline.svg";
import { api } from "src/service/api";

const CreateRoom = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const handleCreateRoomId = async () => {
    const data = {
      host_user: true,
      user_name: userName,
    };
    const response = await api.post("/pokers", data);
    if (response.status == 200) {
      const convertToCamelCase = {
        id: response.data.id,
        hostUser: response.data.host_user,
        roomId: response.data.owner_id,
        selectCard: "",
        userName: response.data.user_name,
      };

      localStorage.setItem("ROOM_DATA", JSON.stringify(convertToCamelCase));
      router.push(`/poker-room/${response.data.owner_id}`);
    }
  };

  const changeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <div className="flex items-center justify-center flex-col max-w-xl mx-auto min-h-screen">
      <div className="mb-10">
        <CreateRoomIcon />
      </div>
      <div className="w-full mb-10">
        <input
          type="text"
          onChange={changeUserName}
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
