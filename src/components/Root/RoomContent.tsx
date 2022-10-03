import Link from "next/link";
import React from "react";

type RoomContentType = {
  href: string;
  icon: React.ReactElement;
  linkLabel: string;
};

export const RoomContent = (props: RoomContentType) => {
  const { href, icon, linkLabel } = props;
  return (
    <div>
      <div className="mb-4">{icon}</div>
      <Link href={href}>
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
          {linkLabel}
        </a>
      </Link>
    </div>
  );
};
