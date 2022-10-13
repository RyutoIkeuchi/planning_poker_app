import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type RoomContentType = {
  href: string;
  icon: React.ReactElement;
  linkLabel: string;
};

export const RoomContent = (props: RoomContentType) => {
  const { href, icon, linkLabel } = props;
  const router = useRouter();
  const confirmNavigationToCreateRoom = (href: string) => {
    const isConfirmed = confirm("部屋を作成します。よろしいですか？");
    if (!isConfirmed) {
      return;
    }
    router.push(href);
  };
  return (
    <div>
      <div className="mb-4">{icon}</div>
      {linkLabel === "部屋を作る" ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block"
          onClick={() => confirmNavigationToCreateRoom(href)}
        >
          {linkLabel}
        </button>
      ) : (
        <Link href={href}>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
            {linkLabel}
          </a>
        </Link>
      )}
    </div>
  );
};
