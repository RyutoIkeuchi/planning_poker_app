import "twin.macro";

import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";
import { setTimeout } from "timers";
import { STEPPER_STATES_LIST } from "src/utils/constants";
import { CreateRoomStatus } from "src/components/CreateRoom/createRoomStatus";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateRoom = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const stepperState = useMemo(() => {
    const titleAndStatus = [
      ...STEPPER_STATES_LIST.FINISH.slice(0, step),
      ...STEPPER_STATES_LIST.IN_PROGRESS.slice(step, step + 1),
      ...STEPPER_STATES_LIST.WAITING.slice(step + 1, step + 3),
    ];
    return {
      current: step,
      titleAndStatus,
    };
  }, [step]);

  const canNavigate = useMemo(() => {
    return step === 3;
  }, [step]);

  const handleCreateRoomId = useCallback(async () => {
    const response = await api.post("/pokers");
    if (response.status === 200) {
      const convertObj = toLowerCamelCaseObj(response.data);
      const addColumnToConvertObj: Required<ToLocalStorageUserType> = {
        ...convertObj,
        selectedNumberCard: "",
      };
      localStorage.setItem("ROOM_DATA", JSON.stringify(addColumnToConvertObj));
      setRoomId(response.data.room_id);
    }
  }, [router]);

  const checkAndDeletePreviousData = useCallback(async () => {
    const existsRoomDataToLocalStorage = [...Array(localStorage.length)].some(
      (d, i) => localStorage.key(i) === "ROOM_DATA",
    );
    if (existsRoomDataToLocalStorage) {
      const roomData = localStorage.getItem("ROOM_DATA");
      const parsedRoomData: ToLocalStorageUserType = JSON.parse(roomData);
      if (parsedRoomData.hostUser) {
        await api.delete(`/pokers/${parsedRoomData.roomId}`);
      } else {
        await api.delete(`/pokers/${parsedRoomData.roomId}/users/${parsedRoomData.id}`);
      }
      localStorage.removeItem("ROOM_DATA");
    }
  }, []);

  useEffect(() => {
    if (step === 0) {
      checkAndDeletePreviousData();
    }

    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 2000);

    if (step === 2) {
      handleCreateRoomId();
    }

    if (step === 3) {
      clearInterval(interval);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [step]);

  return (
    <div tw="pt-20 w-2/3 mx-auto">
      <div tw="mb-20">
        <ol tw="flex items-center justify-between w-full font-medium text-center text-gray-500">
          {stepperState.titleAndStatus.map((item, index) => {
            return (
              <li
                key={item.id}
                tw="flex items-center"
                className={`${item.status === "finish" && "text-blue-600 text-xl"} ${
                  index !== 2 ? "w-2/5" : "w-1/5"
                }`}
              >
                <div
                  tw="flex items-center w-full flex-nowrap"
                  className={`${index === 2 && "justify-end"} ${index === 1 && "ml-8"}`}
                >
                  {item.status === "finish" ? (
                    <FontAwesomeIcon icon={faCheckCircle} tw="text-blue-400 mr-2" />
                  ) : (
                    <span tw="mr-2">{index + 1}</span>
                  )}
                  <p tw="flex-nowrap">{item.title}</p>
                </div>
                {index !== 2 && <div tw="border w-[100px]"></div>}
              </li>
            );
          })}
        </ol>
      </div>
      <CreateRoomStatus canNavigate={canNavigate} isLoading={isLoading} roomId={roomId} />
    </div>
  );
};

export default CreateRoom;
