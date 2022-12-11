import { render, screen } from "@testing-library/react";
import { Middleware, SWRConfig, SWRResponse } from "swr";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import "@testing-library/jest-dom";
import { testMiddleware } from "./AgendaTitleArea.test";

export const testMiddlewareCase2: Middleware = () => {
  return (): SWRResponse<any, any> => {
    const roomData: any = {
      agendaTitle: "テスト中...",
      users: [
        { id: 2, roomId: "3620971", userName: "jean", hostUser: true, selectedNumberCard: "/" },
        { id: 3, roomId: "3620971", userName: "jordan", hostUser: false, selectedNumberCard: "1" },
      ],
      pokerStatus: "reset",
    };
    return {
      data: roomData,
      error: undefined,
      mutate: (_) => Promise.resolve(),
      isValidating: false,
    };
  };
};


describe("Test SprintPointArea Component", () => {
  test("Result時、/を除いた値の平均値を計算してくれること", () => {
    render(
      <SWRConfig value={{ use: [testMiddleware] }}>
        <SprintPointArea roomId="1234567" />
      </SWRConfig>,
    );
    const sprintPointResult = screen.queryByTestId("sprint-point-result");
    expect(sprintPointResult.innerHTML).toBe("4.25");
  });

  test("Reset時、一律で?を表示すること", () => {
    render(
      <SWRConfig value={{ use: [testMiddlewareCase2] }}>
        <SprintPointArea roomId="1234567" />
      </SWRConfig>,
    );
    const sprintPointResult = screen.queryByTestId("sprint-point-result");
    expect(sprintPointResult.innerHTML).toBe("?");
  });
});
