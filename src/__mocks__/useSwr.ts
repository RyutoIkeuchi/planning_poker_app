import { roomDataCase1, roomDataCase2 } from "./roomData";
import { Middleware, SWRResponse } from "swr";
import "@testing-library/jest-dom";

export const testMiddleware: Middleware = () => {
  return (key, fetcher, config): SWRResponse<any, any> => {
    const caseNumber = config.fallback.case;

    const getRoomDataFromMocks = (caseNumber: number) => {
      switch (caseNumber) {
        case 1:
          return roomDataCase1;
        case 2:
          return roomDataCase2;
      }
    };

    return {
      data: getRoomDataFromMocks(caseNumber),
      error: undefined,
      mutate: (_) => Promise.resolve(),
      isValidating: false,
    };
  };
};
