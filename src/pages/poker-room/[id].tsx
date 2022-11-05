import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmModal } from "src/components/ConfirmModal";
import { FibonacciNumbers } from "src/components/FibonacciNumbers";
import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import { RoomUserCardList } from "src/components/PokerRoom/RoomUserCardList";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { usePopState } from "src/hooks/usePopState";
import { api } from "src/service/api";
import { ToLocalStorageUserType } from "src/types";

const PokerRoom = () => {
  usePopState();
  const router = useRouter();
  // 選択したカードと選択できる状態かとモーダルの真偽値
  const [selectNumberCard, setSelectNumberCard] = useState<string>("");
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);

  // routeからroomIdを取得
  const memoQueryId = useMemo(() => {
    if (router.asPath !== router.route && router.query.id !== undefined) {
      return router.query.id as string;
    }
    return "";
  }, [router]);

  const { isError, isLoading, roomData } = usePokerRoom(memoQueryId);

  // ローカルストレージに保存しているデータを取得
  const memoRoomDataToLocalStorage: Required<ToLocalStorageUserType> = useMemo(() => {
    if (typeof window !== "undefined") {
      const response = localStorage.getItem("ROOM_DATA");
      if (typeof response === "string") {
        const parsedResponseData = JSON.parse(response);
        return parsedResponseData;
      }
    }
  }, []);

  const isSelectedNumberCard = useMemo(() => {
    if (roomData && roomData.pokerStatus === "result") {
      return true;
    }
    return false;
  }, [roomData]);

  const canSelectNumberCard = useMemo(() => {
    if (roomData && roomData.pokerStatus === "reset" && roomData.agendaTitle !== "") {
      const fendedMyUserData = roomData.users.find(
        (user) => user.id === memoRoomDataToLocalStorage.id,
      );
      if (fendedMyUserData.isSelected) {
        return false;
      }
      return true;
    }
    return false;
  }, [roomData]);

  // 入れるroomIdと実際にアクセスしているroomIdが一致しているかの確認
  const checkRoomId = () => {
    const roomIdToLocalStorage = memoRoomDataToLocalStorage.roomId;
    if (roomIdToLocalStorage !== memoQueryId) {
      router.replace("/");
    }
  };

  // 選択したカードの確認モーダルを出す
  const handleOpenConfirmModal = useCallback((card: string) => {
    setIsConfirmModal(true);
    setSelectNumberCard(card);
  }, []);

  useEffect(() => {
    if (memoQueryId) {
      checkRoomId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoQueryId]);

  if (isLoading) return <div>待機中...</div>;
  if (isError) return <div>エラーになりました...</div>;

  return (
    <div className="relative">
      <RoomHeader
        roomId={memoQueryId}
        isHostUser={memoRoomDataToLocalStorage?.hostUser}
        userId={memoRoomDataToLocalStorage?.id}
      />
      {isConfirmModal && (
        <ConfirmModal
          selectNumberCard={selectNumberCard}
          roomId={memoQueryId}
          userId={memoRoomDataToLocalStorage?.id}
          userName={memoRoomDataToLocalStorage?.userName || ""}
          setIsConfirmModal={setIsConfirmModal}
        />
      )}
      {memoQueryId && (
        <AgendaTitleArea roomId={memoQueryId} isHostUser={memoRoomDataToLocalStorage?.hostUser} />
      )}
      <SprintPointArea roomId={memoQueryId} />
      <RoomUserCardList
        roomId={memoQueryId}
        myUserName={memoRoomDataToLocalStorage?.userName}
        isSelectedNumberCardResult={isSelectedNumberCard}
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
