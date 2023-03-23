import "twin.macro";
import "rsuite/dist/rsuite.min.css";

import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toLowerCamelCaseObj } from "src/libs";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";
import { Steps } from "rsuite";
import { setTimeout } from "timers";
import { STEPPER_STATES_LIST } from "src/utils/constants";
import { CreateRoomStatus } from "src/components/CreateRoom/createRoomStatus";

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
        <Steps current={stepperState.current}>
          {stepperState.titleAndStatus.map((item) => {
            return <Steps.Item key={item.id} title={item.title} status={item.status} />;
          })}
        </Steps>
      </div>
      <CreateRoomStatus canNavigate={canNavigate} isLoading={isLoading} roomId={roomId} />
    </div>
  );
};

export default CreateRoom;
