import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ConfirmSelectNumberCardModal } from "src/components/ConfirmSelectNumberCardModal";
import { FibonacciNumbers } from "src/components/FibonacciNumbers";
import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import { RoomUserCardList } from "src/components/PokerRoom/RoomUserCardList";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import { api } from "src/service/api";
import { SelectCardUserType, UserType } from "src/types/interface";

const PokerRoom = () => {
  const router = useRouter();
  const [queryId, setQueryId] = useState<string>("");
  const [roomDataToLocalStorage, setRoomDataToLocalStorage] = useState<UserType>();
  const [roomUsers, setRoomUsers] = useState<Array<UserType>>([]);
  const [newMyRoomUser, setNewMyRoomUser] = useState<UserType>();
  const [newSelectNumberCard, setNewSelectNumberCard] = useState<SelectCardUserType>();
  const [newAgendaTitle, setNewAgendaTitle] = useState<string>("");
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [selectNumberCard, setSelectNumberCard] = useState<string>("");
  const [selectNumberCardAverage, setSelectNumberCardAverage] = useState<number>(null);
  const [isSubmitAgendaTitleDisabled, setIsSubmitAgendaTitleDisabled] = useState<boolean>(true);
  const [isCancelAgendaTitleDisabled, setIsCancelAgendaTitleDisabled] = useState<boolean>(true);
  const [isSelectNumberCardResult, setIsSelectNumberCardResult] = useState<boolean>(false);
  const [isResultButtonDisabled, setIsResultButtonDisabled] = useState<boolean>(true);
  const [isAgainButtonDisabled, setIsAgainButtonDisabled] = useState<boolean>(true);
  const [canSelectNumberCard, setCanSelectNumberCard] = useState<boolean>(false);
  const [canChangeAgendaTitle, setCanChangeAgendaTitle] = useState<boolean>(true);

  const [agendaTitle, setAgendaTitle] = useState("");
  const [selectNumberCardStatus, setSelectNumberCardStatus] = useState<
    "result" | "reset" | "default"
  >("default");
  const didLogRef = useRef(false);

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL);

  const handleSubmitAgendaTitle = useCallback(async () => {
    socket.emit("send_agenda_title", {
      agenda_title: agendaTitle,
      room_id: queryId,
    });
    const data = {
      agenda_title: agendaTitle,
    };
    await api.put(`/pokers/${roomDataToLocalStorage?.roomId}`, data);
    setCanChangeAgendaTitle(false);
    setIsCancelAgendaTitleDisabled(false);
  }, [agendaTitle, queryId, roomDataToLocalStorage, socket]);

  const handleCancelAgendaTitle = useCallback(async () => {
    setAgendaTitle("");
    setCanChangeAgendaTitle(true);
    setIsCancelAgendaTitleDisabled(true);
    setIsSelectNumberCardResult(false);
    socket.emit("send_agenda_title", {
      agenda_title: "",
      room_id: queryId,
    });
    const data = {
      agenda_title: "",
    };
    await api.put(`/pokers/${roomDataToLocalStorage?.roomId}`, data);
  }, [queryId, roomDataToLocalStorage, socket]);

  const handleResultSelectNumberCard = useCallback(() => {
    socket.emit("send_select_card_state", {
      room_id: roomDataToLocalStorage?.roomId,
      status: "result",
    });
  }, [roomDataToLocalStorage, socket]);

  useEffect(() => {
    if (didLogRef.current === false) {
      didLogRef.current = true;
      socket.on("connect", () => {
        console.log("接続したよ！");
        socket.emit("join", {
          id: roomDataToLocalStorage?.id,
          host_user: roomDataToLocalStorage?.hostUser,
          room_id: roomDataToLocalStorage?.roomId,
          user_name: roomDataToLocalStorage?.userName,
        });

        socket.on("response_add_user", (data) => {
          setNewMyRoomUser({
            id: data.id,
            hostUser: data.host_user,
            isSelected: false,
            roomId: data.room_id,
            selectCard: "",
            userName: data.user_name,
          });
        });

        socket.on("response_select_number", (data) => {
          console.log("他のユーザーが選んだ番号を受信しました", data);
          setNewSelectNumberCard({
            roomId: data.room_id,
            selectCard: data.select_card,
            userName: data.user_name,
          });
        });

        socket.on("response_agenda_title", (data) => {
          console.log("議題タイトルを受信しました", data);
          setNewAgendaTitle(data.agenda_title);
        });

        socket.on("response_select_card_state", (data) => {
          console.log("カードの状態を受信しました", data);
          setSelectNumberCardStatus(data.status);
        });
      });
    } else {
      didLogRef.current = false;
    }

    return () => {
      if (didLogRef.current === false) {
        socket.disconnect();
      }
    };
  }, [roomDataToLocalStorage]);

  useEffect(() => {
    if (newMyRoomUser && !roomUsers.some((user) => user.userName === newMyRoomUser.userName)) {
      setRoomUsers([...roomUsers, newMyRoomUser]);
    }
  }, [newMyRoomUser]);

  useEffect(() => {
    if (selectNumberCardStatus === "result") {
      calculateAverageOfSelectCard();
      setIsSelectNumberCardResult(true);
    }

    if (selectNumberCardStatus === "reset") {
      setIsSelectNumberCardResult(false);
      setCanSelectNumberCard(true);
      const resetIsSelectedUsers = roomUsers.map((user) => ({
        ...user,
        isSelected: false,
        selectCard: "",
      }));
      setRoomUsers(resetIsSelectedUsers);
    }

    setSelectNumberCardStatus("default");
  }, [selectNumberCardStatus]);

  useEffect(() => {
    if (newSelectNumberCard) {
      setIsAgainButtonDisabled(false);
      const upDataroomUserStatus = roomUsers.map((user) => {
        if (user.userName === newSelectNumberCard.userName) {
          return {
            ...user,
            isSelected: true,
            selectCard: newSelectNumberCard.selectCard,
          };
        }
        return user;
      });
      setRoomUsers(upDataroomUserStatus);

      const checkNumberNotSelected = upDataroomUserStatus.some((user) => !user.isSelected);
      if (!checkNumberNotSelected) {
        setIsResultButtonDisabled(false);
      }
    }
  }, [newSelectNumberCard]);

  useEffect(() => {
    if (newAgendaTitle !== "") {
      setAgendaTitle(newAgendaTitle);
      setIsSubmitAgendaTitleDisabled(true);
      setCanSelectNumberCard(true);
    } else {
      const resetIsSelectedUsers = roomUsers.map((user) => ({
        ...user,
        isSelected: false,
      }));
      setRoomUsers(resetIsSelectedUsers);
      setAgendaTitle("");
      setCanSelectNumberCard(false);
    }
  }, [newAgendaTitle]);

  const checkRoomId = async (queryId: string) => {
    if (roomDataToLocalStorage?.roomId !== queryId) {
      router.replace("/");
    }
    try {
      const response = await api.get(`/pokers/${queryId}`);
      const convertToCamelCase = response.data.users.map((res: any) => ({
        id: res.id,
        hostUser: res.host_user,
        isSelected: res.select_number_card !== "",
        roomId: res.owner_id,
        selectCard: res.select_number_card,
        userName: res.user_name,
      }));
      setRoomUsers(convertToCamelCase);
      const allRoomUserIsSelected = convertToCamelCase.every((user) => user.isSelected);
      const agendaTitle = response.data.agenda_title;
      setAgendaTitle(agendaTitle);
      if (agendaTitle !== "") {
        setIsCancelAgendaTitleDisabled(false);
        setIsSubmitAgendaTitleDisabled(true);
        setCanChangeAgendaTitle(false);
        setCanSelectNumberCard(true);
        if (allRoomUserIsSelected) {
          setCanSelectNumberCard(false);
          setIsResultButtonDisabled(false);
          setIsAgainButtonDisabled(false);
          setSelectNumberCardStatus("result");
        }
      }
    } catch (error) {
      if ((error as AxiosError).response?.status == 404) {
        console.log("部屋が見つかりません");
        router.push("/");
      }
    }
  };

  const getRoomDataToLocalStorage = useCallback(() => {
    const response = localStorage.getItem("ROOM_DATA");
    if (typeof response == "string") {
      setRoomDataToLocalStorage(JSON.parse(response));
    }
  }, []);

  const handleLeaveTheRoom = useCallback(async () => {
    localStorage.removeItem("ROOM_DATA");
    const response = await api.delete(
      `/pokers/${roomDataToLocalStorage?.roomId}/users/${roomDataToLocalStorage?.id}`,
    );
    if (response.status == 204) {
      if (roomDataToLocalStorage?.hostUser) {
        await api.delete(`/pokers/${queryId}`);
      }
      router.push("/");
    }
  }, [roomDataToLocalStorage, queryId, router]);

  const handleOpenConfirmModal = useCallback((useSelectNumberCard: string) => {
    setIsConfirmModal(true);
    setSelectNumberCard(useSelectNumberCard);
  }, []);

  const handleAgainSelectNumberCard = useCallback(async () => {
    setIsResultButtonDisabled(true);
    socket.emit("send_select_card_state", {
      room_id: roomDataToLocalStorage?.roomId,
      status: "reset",
    });
    await api.put(`/pokers/${roomDataToLocalStorage?.roomId}/users/`);
  }, [roomDataToLocalStorage, socket]);

  const calculateAverageOfSelectCard = useCallback(() => {
    const filterNotSelectUserList = roomUsers.filter((user) => {
      if (user.selectCard !== "/") {
        return user;
      }
    });
    const total: number = filterNotSelectUserList.reduce(
      (acc, cur: UserType) => acc + Number(cur.selectCard),
      0,
    );
    const average = total / filterNotSelectUserList.length;
    setSelectNumberCardAverage(average);
  }, [roomUsers]);

  useEffect(() => {
    if (router.asPath !== router.route) {
      if (router.query.id != undefined) {
        const queryId = router.query.id as string;
        setQueryId(queryId);
      }
    }
  }, [router]);

  useEffect(() => {
    getRoomDataToLocalStorage();
    if (queryId) {
      checkRoomId(queryId);
    }
  }, [queryId]);

  const handleBeforeUnload = useCallback((event) => {
    event.returnValue = "ポーカールーム画面から離れます";
  }, []);

  const handlePopState = useCallback(() => {
    alert("ブラウザバックを使わないでください。");
    history.go(1);
  }, []);

  useEffect(() => {
    history.pushState(null, null, null);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="relative">
      <RoomHeader roomId={router.query.id as string} handleLeaveTheRoom={handleLeaveTheRoom} />
      {isConfirmModal && (
        <ConfirmSelectNumberCardModal
          selectNumberCard={selectNumberCard}
          socket={socket}
          roomId={queryId}
          userId={roomDataToLocalStorage?.id}
          userName={roomDataToLocalStorage?.userName || ""}
          setIsConfirmModal={setIsConfirmModal}
          setCanSelectNumberCard={setCanSelectNumberCard}
        />
      )}
      <AgendaTitleArea
        isHostUser={roomDataToLocalStorage?.hostUser}
        agendaTitle={agendaTitle}
        setAgendaTitle={setAgendaTitle}
        canChangeAgendaTitle={canChangeAgendaTitle}
        handleSubmitAgendaTitle={handleSubmitAgendaTitle}
        isSubmitAgendaTitleDisabled={isSubmitAgendaTitleDisabled}
        setIsSubmitAgendaTitleDisabled={setIsSubmitAgendaTitleDisabled}
        handleCancelAgendaTitle={handleCancelAgendaTitle}
        isCancelAgendaTitleDisabled={isCancelAgendaTitleDisabled}
        handleResultSelectNumberCard={handleResultSelectNumberCard}
        isResultButtonDisabled={isResultButtonDisabled}
        handleAgainSelectNumberCard={handleAgainSelectNumberCard}
        isAgainButtonDisabled={isAgainButtonDisabled}
      />
      <SprintPointArea
        isSelectNumberCardResult={isSelectNumberCardResult}
        selectNumberCardAverage={selectNumberCardAverage}
      />
      <RoomUserCardList
        roomUsers={roomUsers}
        myUserName={roomDataToLocalStorage?.userName}
        isSelectNumberCardResult={isSelectNumberCardResult}
      />
      <div className="fixed bottom-0">
        <div className="mb-4 flex justify-start items-center">
          <p className="text-xl mr-2">カードを選択</p>
          {canSelectNumberCard ? (
            <FontAwesomeIcon icon={faBan} className="text-red-600" />
          ) : (
            <FontAwesomeIcon icon={faCheck} className="text-green-600" />
          )}
        </div>
        <FibonacciNumbers
          handleOpenConfirmModal={handleOpenConfirmModal}
          canSelectNumberCard={canSelectNumberCard}
        />
        <hr />
      </div>
    </div>
  );
};

export default PokerRoom;
