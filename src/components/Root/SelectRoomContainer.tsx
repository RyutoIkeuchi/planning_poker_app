import "twin.macro";

import React from "react";
import { Footer } from "src/components/Common/Footer";
import { CreateRoomIcon } from "src/components/Icon/CreateRoomIcon";
import { EnterRoomIcon } from "src/components/Icon/EnterRoomIcon";
import { RoomContent } from "src/components/Root/RoomContent";

export const SelectRoomContainer = () => {
  return (
    <>
      <div tw="flex justify-center items-center min-h-screen">
        <div tw="flex justify-between w-full">
          <RoomContent icon={<CreateRoomIcon />} href="/create-room" linkLabel="部屋を作る" />
          <div tw="h-auto border border-blue-700"></div>
          <RoomContent icon={<EnterRoomIcon />} href="/enter-room" linkLabel="部屋に入る" />
        </div>
      </div>
      <Footer />
    </>
  );
};
