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
import { usePopState } from "src/hooks/usePopState";
import { api } from "src/service/api";
import { PokerStatusType, ResSelectedNumberCardType, UserType } from "src/types";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL);

const PokerRoom = () => {
  usePopState();
  const router = useRouter();
  const [roomUsers, setRoomUsers] = useState<Array<UserType>>([]);
  // 議題の文字と入力できるかの真偽値
  const [agendaTitle, setAgendaTitle] = useState("");
  const [canChangeAgendaTitle, setCanChangeAgendaTitle] = useState<boolean>(true);
  // 議題の送信とキャンセルの真偽値
  const [isSubmitAgendaTitleDisabled, setIsSubmitAgendaTitleDisabled] = useState<boolean>(true);
  const [isCancelAgendaTitleDisabled, setIsCancelAgendaTitleDisabled] = useState<boolean>(true);
  // 選択したカードと選択できる状態かとモーダルの真偽値
  const [selectNumberCard, setSelectNumberCard] = useState<string>("");
  const [canSelectNumberCard, setCanSelectNumberCard] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  // ポーカーの結果ともう一度ボタンの真偽値
  const [isResultButtonDisabled, setIsResultButtonDisabled] = useState<boolean>(true);
  const [isAgainButtonDisabled, setIsAgainButtonDisabled] = useState<boolean>(true);

  // socketで受け取った値をstate管理するもの
  const [resNewUserToSocket, setResNewUserToSocket] = useState<UserType>();
  const [resNewCardToSocket, setResNewCardToSocket] = useState<ResSelectedNumberCardType>();
  const [resNewAgendaTitleToSocket, setResNewAgendaTitleToSocket] = useState<string>("");
  const [resPokerStatusToSocket, setResPokerStatusToSocket] = useState<PokerStatusType>("default");

  const didLogRef = useRef(false);

  // ローカルストレージに保存しているデータを取得
  const memoRoomDataToLocalStorage = useMemo(() => {
    if (typeof window !== "undefined") {
      const response = localStorage.getItem("ROOM_DATA");
      if (typeof response === "string") {
        const parsedResponseData = JSON.parse(response);
        return parsedResponseData;
      }
    }
  }, []);

  // 部屋にいる全てのユーザーがカードを選択済みかの確認
  const memoIsAllUserIsSelected = useMemo(() => {
    return roomUsers.every((user) => user.isSelected);
  }, [roomUsers]);

  // result(結果を出す)、reset(再度カード選択)、defaultの3パターン
  const memoPokerStatus = useMemo(() => {
    if (isResultButtonDisabled && memoIsAllUserIsSelected) {
      return "result";
    }
    return resPokerStatusToSocket;
  }, [resPokerStatusToSocket, memoIsAllUserIsSelected, isResultButtonDisabled]);

  // ポーカーの結果を出しても大丈夫かの確認
  const memoIsSelectedNumberCardResult = useMemo(() => {
    if (canChangeAgendaTitle) {
      return false;
    }
    return memoPokerStatus === "result";
  }, [memoPokerStatus, canChangeAgendaTitle]);

  // 部屋に入るユーザーの選択したカードの平均値を割り出す
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
    return average;
  }, [roomUsers]);

  // statusが'result'になったら平均値を取得
  const memoSelectedNumberCardAverage = useMemo(() => {
    if (memoPokerStatus === "result") {
      console.log("こっち行った");
      return calculateAverageOfSelectCard();
    }
    return 0;
  }, [calculateAverageOfSelectCard, memoPokerStatus]);

  // routeからroomIdを取得
  const memoQueryId = useMemo(() => {
    if (router.asPath !== router.route && router.query.id !== undefined) {
      return router.query.id as string;
    }
    return "";
  }, [router]);

  // 入れるroomIdと実際にアクセスしているroomIdが一致しているかの確認
  const checkRoomId = async () => {
    const roomIdToLocalStorage = memoRoomDataToLocalStorage.roomId;
    if (roomIdToLocalStorage !== memoQueryId) {
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
          setIsResultButtonDisabled(true);
          setIsAgainButtonDisabled(false);
          // setResPokerStatusToSocket("result");
        }
      }
    } catch (error) {
      if ((error as AxiosError).response?.status == 404) {
        console.log("部屋が見つかりません");
        router.push("/");
      }
    }
  };

  // 議題をAPIとsocketに送信
  const handleSubmitAgendaTitle = useCallback(async () => {
    socket.emit("send_agenda_title", {
      agenda_title: agendaTitle,
      room_id: memoQueryId,
    });
    const data = {
      agenda_title: agendaTitle,
    };
    await api.put(`/pokers/${memoRoomDataToLocalStorage?.roomId}`, data);
    setCanChangeAgendaTitle(false);
    setIsCancelAgendaTitleDisabled(false);
  }, [agendaTitle, memoQueryId, memoRoomDataToLocalStorage, socket]);

  // 議題を取り消す処理をAPIとsocketに行う
  const handleCancelAgendaTitle = useCallback(async () => {
    setAgendaTitle("");
    setCanChangeAgendaTitle(true);
    setIsCancelAgendaTitleDisabled(true);
    // setIsSelectedNumberCardResult(false);
    socket.emit("send_agenda_title", {
      agenda_title: "",
      room_id: memoQueryId,
    });
    const data = {
      agenda_title: "",
    };
    await api.put(`/pokers/${memoRoomDataToLocalStorage?.roomId}`, data);
    await api.put(`/pokers/${memoRoomDataToLocalStorage?.roomId}/users`);
  }, [memoQueryId, memoRoomDataToLocalStorage, socket]);

  // 選択したカードの確認モーダルを出す
  const handleOpenConfirmModal = useCallback((useSelectNumberCard: string) => {
    setIsConfirmModal(true);
    setSelectNumberCard(useSelectNumberCard);
  }, []);

  // 結果を出せることをsocketでroomユーザー全員に送信
  const handleResultSelectNumberCard = useCallback(() => {
    socket.emit("send_poker_status", {
      room_id: memoRoomDataToLocalStorage?.roomId,
      status: "result",
    });
  }, [memoRoomDataToLocalStorage, socket]);

  // もう一度カードを選択し直す処理をAPIとsocketに送信
  const handleAgainSelectNumberCard = useCallback(async () => {
    setIsResultButtonDisabled(true);
    socket.emit("send_poker_status", {
      room_id: memoRoomDataToLocalStorage?.roomId,
      status: "reset",
    });
    const resetIsSelectedUsers = roomUsers.map((user) => ({
      ...user,
      isSelected: false,
      selectedNumberCard: "",
    }));
    setRoomUsers(resetIsSelectedUsers);
    await api.put(`/pokers/${memoRoomDataToLocalStorage?.roomId}/users/`);
  }, [memoRoomDataToLocalStorage, socket]);

  // 部屋を離れて、APIのデータから自分のユーザー情報を削除
  const handleLeaveTheRoom = useCallback(async () => {
    localStorage.removeItem("ROOM_DATA");
    const response = await api.delete(
      `/pokers/${memoRoomDataToLocalStorage?.roomId}/users/${memoRoomDataToLocalStorage?.id}`,
    );
    if (response.status == 204) {
      if (memoRoomDataToLocalStorage?.hostUser) {
        await api.delete(`/pokers/${memoQueryId}`);
      }
      router.push("/");
    }
  }, [memoRoomDataToLocalStorage, memoQueryId, router]);

  useEffect(() => {
    if (memoQueryId) {
      checkRoomId();
    }
  }, [memoQueryId]);

  useEffect(() => {
    if (didLogRef.current === false) {
      didLogRef.current = true;
      socket.on("connect", () => {
        console.log("接続したよ！");
        socket.emit("join", {
          id: memoRoomDataToLocalStorage?.id,
          host_user: memoRoomDataToLocalStorage?.hostUser,
          room_id: memoRoomDataToLocalStorage?.roomId,
          user_name: memoRoomDataToLocalStorage?.userName,
        });

        socket.on("res_add_user", (data) => {
          setResNewUserToSocket({
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
          setResNewCardToSocket({
            roomId: data.room_id,
            selectedNumberCard: data.selected_number_card,
            userName: data.user_name,
          });
        });

        socket.on("res_agenda_title", (data) => {
          console.log("議題タイトルを受信しました", data);
          setResNewAgendaTitleToSocket(data.agenda_title);
        });

        socket.on("res_poker_status", (data) => {
          console.log("カードの状態を受信しました", data);
          setResPokerStatusToSocket(data.status);
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
  }, [memoRoomDataToLocalStorage]);

  useEffect(() => {
    if (
      resNewUserToSocket &&
      !roomUsers.some((user) => user.userName === resNewUserToSocket.userName)
    ) {
      setRoomUsers([...roomUsers, resNewUserToSocket]);
    }
  }, [resNewUserToSocket]);

  useEffect(() => {
    if (resNewAgendaTitleToSocket !== "") {
      setAgendaTitle(resNewAgendaTitleToSocket);
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
  }, [resNewAgendaTitleToSocket]);

  useEffect(() => {
    if (resNewCardToSocket) {
      setIsAgainButtonDisabled(false);
      const updateRoomUserStatus = roomUsers.map((user) => {
        if (user.userName === resNewCardToSocket.userName) {
          return {
            ...user,
            isSelected: true,
            selectedNumberCard: resNewCardToSocket.selectedNumberCard,
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
  }, [resNewCardToSocket]);

  useEffect(() => {
    if (resPokerStatusToSocket === "reset") {
      setCanSelectNumberCard(true);
      const resetIsSelectedUsers = roomUsers.map((user) => ({
        ...user,
        isSelected: false,
        selectedNumberCard: "",
      }));
      setRoomUsers(resetIsSelectedUsers);
    }
  }, [resPokerStatusToSocket]);

  return (
    <div className="relative">
      <RoomHeader roomId={router.query.id as string} handleLeaveTheRoom={handleLeaveTheRoom} />
      {isConfirmModal && (
        <ConfirmSelectNumberCardModal
          selectNumberCard={selectNumberCard}
          socket={socket}
          roomId={memoQueryId}
          userId={memoRoomDataToLocalStorage?.id}
          userName={memoRoomDataToLocalStorage?.userName || ""}
          setIsConfirmModal={setIsConfirmModal}
          setCanSelectNumberCard={setCanSelectNumberCard}
        />
      )}
      {memoQueryId && (
        <AgendaTitleArea
          isHostUser={memoRoomDataToLocalStorage?.hostUser}
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
      )}
      <SprintPointArea
        isSelectedNumberCardResult={memoIsSelectedNumberCardResult}
        selectedNumberCardAverage={memoSelectedNumberCardAverage}
      />
      <RoomUserCardList
        roomUsers={roomUsers}
        myUserName={memoRoomDataToLocalStorage?.userName}
        isSelectedNumberCardResult={memoIsSelectedNumberCardResult}
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
