import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import { ConfirmSelectNumberCardModal } from "src/components/ConfirmSelectNumberCardModal";
import { FibonacciNumbers } from "src/components/FibonacciNumbers";
import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import { RoomUserCardList } from "src/components/PokerRoom/RoomUserCardList";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import { api } from "src/service/api";
import { ResSelectedNumberCardType, UserType } from "src/types";

const PokerRoom = () => {
  const router = useRouter();
  const [myRoomDataToLocalStorage, setMyRoomDataToLocalStorage] = useState<UserType>();
  const [roomUsers, setRoomUsers] = useState<Array<UserType>>([]);
  const [newMyRoomUser, setNewMyRoomUser] = useState<UserType>();
  const [newSelectedNumberCard, setNewSelectedNumberCard] = useState<ResSelectedNumberCardType>();
  const [newAgendaTitle, setNewAgendaTitle] = useState<string>("");
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [selectNumberCard, setSelectNumberCard] = useState<string>("");
  const [selectedNumberCardAverage, setSelectedNumberCardAverage] = useState<number>(null);
  const [isSubmitAgendaTitleDisabled, setIsSubmitAgendaTitleDisabled] = useState<boolean>(true);
  const [isCancelAgendaTitleDisabled, setIsCancelAgendaTitleDisabled] = useState<boolean>(true);
  const [isSelectedNumberCardResult, setIsSelectedNumberCardResult] = useState<boolean>(false);
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

  const memoQueryId = useMemo(() => {
    if (router.asPath !== router.route && router.query.id !== undefined) {
      return router.query.id as string;
    }
    return "";
  }, [router]);

  const handleSubmitAgendaTitle = useCallback(async () => {
    socket.emit("send_agenda_title", {
      agenda_title: agendaTitle,
      room_id: memoQueryId,
    });
    const data = {
      agenda_title: agendaTitle,
    };
    await api.put(`/pokers/${myRoomDataToLocalStorage?.roomId}`, data);
    setCanChangeAgendaTitle(false);
    setIsCancelAgendaTitleDisabled(false);
  }, [agendaTitle, memoQueryId, myRoomDataToLocalStorage, socket]);

  const handleCancelAgendaTitle = useCallback(async () => {
    setAgendaTitle("");
    setCanChangeAgendaTitle(true);
    setIsCancelAgendaTitleDisabled(true);
    setIsSelectedNumberCardResult(false);
    socket.emit("send_agenda_title", {
      agenda_title: "",
      room_id: memoQueryId,
    });
    const data = {
      agenda_title: "",
    };
    await api.put(`/pokers/${myRoomDataToLocalStorage?.roomId}`, data);
  }, [memoQueryId, myRoomDataToLocalStorage, socket]);

  const handleResultSelectNumberCard = useCallback(() => {
    socket.emit("send_poker_status", {
      room_id: myRoomDataToLocalStorage?.roomId,
      status: "result",
    });
  }, [myRoomDataToLocalStorage, socket]);

  useEffect(() => {
    if (didLogRef.current === false) {
      didLogRef.current = true;
      socket.on("connect", () => {
        console.log("接続したよ！");
        socket.emit("join", {
          id: myRoomDataToLocalStorage?.id,
          host_user: myRoomDataToLocalStorage?.hostUser,
          room_id: myRoomDataToLocalStorage?.roomId,
          user_name: myRoomDataToLocalStorage?.userName,
        });

        socket.on("res_add_user", (data) => {
          setNewMyRoomUser({
            id: data.id,
            hostUser: data.host_user,
            isSelected: false,
            roomId: data.room_id,
            selectedNumberCard: "",
            userName: data.user_name,
          });
        });

        socket.on("res_selected_number_card", (data) => {
          console.log("他のユーザーが選んだ番号を受信しました", data);
          setNewSelectedNumberCard({
            roomId: data.room_id,
            selectedNumberCard: data.selected_number_card,
            userName: data.user_name,
          });
        });

        socket.on("res_agenda_title", (data) => {
          console.log("議題タイトルを受信しました", data);
          setNewAgendaTitle(data.agenda_title);
        });

        socket.on("res_poker_status", (data) => {
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
  }, [myRoomDataToLocalStorage]);

  useEffect(() => {
    if (newMyRoomUser && !roomUsers.some((user) => user.userName === newMyRoomUser.userName)) {
      setRoomUsers([...roomUsers, newMyRoomUser]);
    }
  }, [newMyRoomUser]);

  useEffect(() => {
    if (selectNumberCardStatus === "result") {
      calculateAverageOfSelectCard();
      setIsSelectedNumberCardResult(true);
    }

    if (selectNumberCardStatus === "reset") {
      setIsSelectedNumberCardResult(false);
      setCanSelectNumberCard(true);
      const resetIsSelectedUsers = roomUsers.map((user) => ({
        ...user,
        isSelected: false,
        selectedNumberCard: "",
      }));
      setRoomUsers(resetIsSelectedUsers);
    }

    setSelectNumberCardStatus("default");
  }, [selectNumberCardStatus]);

  useEffect(() => {
    if (newSelectedNumberCard) {
      setIsAgainButtonDisabled(false);
      const updateRoomUserStatus = roomUsers.map((user) => {
        if (user.userName === newSelectedNumberCard.userName) {
          return {
            ...user,
            isSelected: true,
            selectedNumberCard: newSelectedNumberCard.selectedNumberCard,
          };
        }
        return user;
      });
      setRoomUsers(updateRoomUserStatus);

      const checkNumberNotSelected = updateRoomUserStatus.every((user) => user.isSelected);
      if (checkNumberNotSelected) {
        setIsResultButtonDisabled(false);
      }
    }
  }, [newSelectedNumberCard]);

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

  const checkRoomId = async (localRoomId: string) => {
    if (localRoomId !== memoQueryId) {
      router.replace("/");
    }
    try {
      const response = await api.get(`/pokers/${memoQueryId}`);
      const convertToCamelCase = response.data.users.map((res: any) => ({
        id: res.id,
        hostUser: res.host_user,
        isSelected: res.selected_number_card !== "",
        roomId: res.owner_id,
        selectedNumberCard: res.selected_number_card,
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
    if (typeof response === "string") {
      const parsedResponseData = JSON.parse(response);
      setMyRoomDataToLocalStorage(parsedResponseData);
      return parsedResponseData.roomId;
    }
  }, []);

  const handleLeaveTheRoom = useCallback(async () => {
    localStorage.removeItem("ROOM_DATA");
    const response = await api.delete(
      `/pokers/${myRoomDataToLocalStorage?.roomId}/users/${myRoomDataToLocalStorage?.id}`,
    );
    if (response.status == 204) {
      if (myRoomDataToLocalStorage?.hostUser) {
        await api.delete(`/pokers/${memoQueryId}`);
      }
      router.push("/");
    }
  }, [myRoomDataToLocalStorage, memoQueryId, router]);

  const handleOpenConfirmModal = useCallback((useSelectNumberCard: string) => {
    setIsConfirmModal(true);
    setSelectNumberCard(useSelectNumberCard);
  }, []);

  const handleAgainSelectNumberCard = useCallback(async () => {
    setIsResultButtonDisabled(true);
    socket.emit("send_poker_status", {
      room_id: myRoomDataToLocalStorage?.roomId,
      status: "reset",
    });
    await api.put(`/pokers/${myRoomDataToLocalStorage?.roomId}/users/`);
  }, [myRoomDataToLocalStorage, socket]);

  const calculateAverageOfSelectCard = useCallback(() => {
    const filterNotSelectUserList = roomUsers.filter((user) => {
      if (user.selectedNumberCard !== "/") {
        return user;
      }
    });
    const total: number = filterNotSelectUserList.reduce(
      (acc, cur: UserType) => acc + Number(cur.selectedNumberCard),
      0,
    );
    const average = total / filterNotSelectUserList.length;
    setSelectedNumberCardAverage(average);
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
    const resQueryIdToLocalStorage = getRoomDataToLocalStorage();
    if (memoQueryId) {
      checkRoomId(resQueryIdToLocalStorage);
    }
  }, [memoQueryId]);

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
          roomId={memoQueryId}
          userId={myRoomDataToLocalStorage?.id}
          userName={myRoomDataToLocalStorage?.userName || ""}
          setIsConfirmModal={setIsConfirmModal}
          setCanSelectNumberCard={setCanSelectNumberCard}
        />
      )}
      <AgendaTitleArea
        isHostUser={myRoomDataToLocalStorage?.hostUser}
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
        isSelectedNumberCardResult={isSelectedNumberCardResult}
        selectedNumberCardAverage={selectedNumberCardAverage}
      />
      <RoomUserCardList
        roomUsers={roomUsers}
        myUserName={myRoomDataToLocalStorage?.userName}
        isSelectedNumberCardResult={isSelectedNumberCardResult}
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
