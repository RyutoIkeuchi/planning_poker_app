import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";

const CreateRoom = () => {
  const router = useRouter();
  const [percentage, setPercentage] = useState(0);
  const [is100Percent, setIs100Percent] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleCreateRoomId = useCallback(async () => {
    const response = await api.post("/pokers");
    if (response.status == 200) {
      const convertObj = toLowerCamelCaseObj(response.data);
      const addColumnToConvertObj: Required<ToLocalStorageUserType> = {
        ...convertObj,
        selectedNumberCard: "",
      };
      localStorage.setItem("ROOM_DATA", JSON.stringify(addColumnToConvertObj));
      setRoomId(response.data.room_id);
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => prev + 10);
    }, 500);

    if (percentage >= 100) {
      setIs100Percent(true);
      handleCreateRoomId();
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [percentage]);

  return (
    <div className="flex items-center justify-center flex-col max-w-xl mx-auto min-h-screen">
      <div className="mb-10">
        <div style={{ height: 400, width: 400 }}>
          <CircularProgressbarWithChildren
            value={percentage}
            styles={buildStyles({
              backgroundColor: "rgb(59 130 246)",
              pathColor: "rgb(59 130 246)",
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              strokeLinecap: "round",
              trailColor: "#d6d6d6",
            })}
          >
            {is100Percent && roomId !== "" ? (
              <Link href={`/poker-room/${roomId}`}>
                <a className="text-2xl font-bold text-center underline flex items-center justify-center">
                  <p className="mr-2">遷移する</p>
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                </a>
              </Link>
            ) : (
              <p className="text-2xl font-bold text-center">作成中...</p>
            )}
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
