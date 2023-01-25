import "twin.macro";

import { ReactNode } from "react";

export const Layout = (props: { children: ReactNode }) => {
  return (
    <div className="bg-blue-50">
      <div className="container mx-auto max-w-5xl min-h-screen">{props.children}</div>
    </div>
  );
};
