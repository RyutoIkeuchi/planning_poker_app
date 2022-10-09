import { useCallback, useEffect } from "react";

export const usePopState = () => {
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
};
