import "twin.macro";

import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingCircle } from "src/components/Common/LoadingCircle";
import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { ConfirmModal } from "src/components/PokerRoom/ConfirmModal";
import { FibonacciNumbers } from "src/components/PokerRoom/FibonacciNumbers";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import { RoomUserCardList } from "src/components/PokerRoom/RoomUserCardList";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import { usePokerRoom } from "src/hooks/usePokerRoom";
import { usePopState } from "src/hooks/usePopState";
import { ToLocalStorageUserType } from "src/types";

const PokerRoom = () => {
  usePopState();
  const router = useRouter();
  // 選択したカードと選択できる状態かとモーダルの真偽値
  const [selectNumberCard, setSelectNumberCard] = useState<string>("");
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);

  // routeからroomIdを取得
  const queryId = useMemo(() => {
    if (router.asPath !== router.route && router.query.id !== undefined) {
      return router.query.id as string;
    }
    return "";
  }, [router]);

  const { isError, isLoading, roomData } = usePokerRoom(queryId);

  // ローカルストレージに保存しているデータを取得
  const roomDataToLocalStorage: Required<ToLocalStorageUserType> = useMemo(() => {
    if (typeof window !== "undefined") {
      const response = localStorage.getItem("ROOM_DATA");
      if (typeof response === "string") {
        const parsedResponseData = JSON.parse(response);
        return parsedResponseData;
      }
    }
  }, []);

  const canSelectNumberCard = useMemo(() => {
    if (roomData && roomData.pokerStatus === "reset" && roomData.agendaTitle !== "") {
      const findMyUserData = roomData.users.find((user) => user.id === roomDataToLocalStorage.id);
      if (findMyUserData.isSelected) {
        return false;
      }
      return true;
    }
    return false;
  }, [roomData]);

  // 入れるroomIdと実際にアクセスしているroomIdが一致しているかの確認
  const checkRoomId = () => {
    const roomIdToLocalStorage = roomDataToLocalStorage.roomId;
    if (roomIdToLocalStorage !== queryId) {
      router.replace("/");
    }
  };

  // 選択したカードの確認モーダルを出す
  const handleOpenConfirmModal = useCallback((card: string) => {
    setIsConfirmModal(true);
    setSelectNumberCard(card);
  }, []);

  useEffect(() => {
    if (queryId) {
      checkRoomId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  if (isLoading) return <LoadingCircle />;

  if (isError) return <div>エラーになりました...</div>;

  return (
    <div tw="relative">
      <RoomHeader
        roomId={queryId}
        isHostUser={roomDataToLocalStorage?.hostUser}
        userId={roomDataToLocalStorage?.id}
      />
      {isConfirmModal && (
        <ConfirmModal
          selectNumberCard={selectNumberCard}
          roomId={queryId}
          userId={roomDataToLocalStorage?.id}
          userName={roomDataToLocalStorage?.userName || ""}
          setIsConfirmModal={setIsConfirmModal}
        />
      )}
      {queryId && (
        <AgendaTitleArea roomId={queryId} isHostUser={roomDataToLocalStorage?.hostUser} />
      )}
      <SprintPointArea roomId={queryId} />
      <RoomUserCardList roomId={queryId} myUserName={roomDataToLocalStorage?.userName} />
      <div tw="fixed bottom-0">
        <div tw="mb-4 flex justify-start items-center">
          <p tw="text-xl mr-2">カードを選択</p>
          {canSelectNumberCard ? (
            <FontAwesomeIcon icon={faCheck} tw="text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faBan} tw="text-red-600" />
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
