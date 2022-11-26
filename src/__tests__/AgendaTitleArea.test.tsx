import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { render, screen } from "@testing-library/react";
import { Middleware, SWRConfig, SWRResponse } from "swr";

export const testMiddleware: Middleware = () => {
  return (): SWRResponse<any, any> => {
    const roomData: any = {
      agendaTitle: "テスト中...",
      users: [
        { id: 2, roomId: "3620971", userName: "jean", hostUser: true, selectedNumberCard: "" },
      ],
    };
    return {
      data: roomData,
      error: undefined,
      mutate: (_) => Promise.resolve(),
      isValidating: false,
    };
  };
};

describe("Test AgendaTitleArea Component", () => {
  test("ホストユーザーではない時の議題表示エリアのUI", () => {
    render(
      <SWRConfig value={{ use: [testMiddleware] }}>
        <AgendaTitleArea roomId="1234567" isHostUser={false} />
      </SWRConfig>,
    );
    const agendaTitle = screen.getByTestId("test-agenda-title");
    expect(agendaTitle.innerHTML).toBe("議題：テスト中...");
    expect(screen.queryByRole("button", { name: "決定" })).toBeNull();
    expect(screen.queryByRole("button", { name: "取り消し" })).toBeNull();
    expect(screen.queryByRole("button", { name: "結果を見る" })).toBeNull();
    expect(screen.queryByRole("button", { name: "もう一度" })).toBeNull();
    expect(screen.queryByPlaceholderText("議題を入力")).toBeNull();
  });

  test("ホストユーザー時の議題表示エリアのUI", () => {
    render(
      <SWRConfig value={{ use: [testMiddleware] }}>
        <AgendaTitleArea roomId="1234567" isHostUser={true} />
      </SWRConfig>,
    );

    const agendaTitle = screen.queryByTestId("test-agenda-title");
    expect(agendaTitle).toBeNull();
    expect(screen.queryByRole("button", { name: "決定" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "取り消し" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "結果を見る" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "もう一度" })).not.toBeNull();
    expect(screen.queryByPlaceholderText("議題を入力")).not.toBeNull();
  });
});
