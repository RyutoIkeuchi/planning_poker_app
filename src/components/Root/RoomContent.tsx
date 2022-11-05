import "twin.macro";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

type RoomContentType = {
  href: string;
  icon: React.ReactElement;
  linkLabel: string;
};

export const RoomContent = (props: RoomContentType) => {
  const { href, icon, linkLabel } = props;
  const router = useRouter();

  const confirmNavigationToCreateRoom = useCallback(
    (href: string) => {
      const isConfirmed = confirm("部屋を作成します。よろしいですか？");
      if (!isConfirmed) {
        return;
      }
      router.push(href);
    },
    [router],
  );

  return (
    <div>
      <div tw="mb-4">{icon}</div>
      {linkLabel === "部屋を作る" ? (
        <button
          tw="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block"
          onClick={() => confirmNavigationToCreateRoom(href)}
        >
          {linkLabel}
        </button>
      ) : (
        <Link href={href}>
          <button tw="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
            {linkLabel}
          </button>
        </Link>
      )}
    </div>
  );
};
