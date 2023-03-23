import { AgendaTitleArea } from "src/components/PokerRoom/AgendaTitleArea";
import { render, screen } from "@testing-library/react";
import { SWRConfig } from "swr";
import { testMiddleware } from "src/__mocks__/useSwr";

describe("<AgendaTitleArea />", () => {
  test("ホストユーザーではない時の議題表示エリアのUI", () => {
    render(
      <SWRConfig value={{ fallback: { case: 2 }, use: [testMiddleware] }}>
        <AgendaTitleArea roomId="1234567" isHostUser={false} />
      </SWRConfig>,
    );
    const agendaTitle = screen.getByTestId("test-agenda-title");
    expect(agendaTitle.innerHTML).toBe("議題：テスト中...");
    expect(screen.queryByRole("button", { name: "決定" })).toBeNull();
    expect(screen.queryByRole("button", { name: "リセット" })).toBeNull();
    expect(screen.queryByRole("button", { name: "結果を見る" })).toBeNull();
    expect(screen.queryByRole("button", { name: "もう一度" })).toBeNull();
    expect(screen.queryByPlaceholderText("議題を入力")).toBeNull();
  });

  test("ホストユーザー時の議題表示エリアのUI", () => {
    render(
      <SWRConfig value={{ fallback: { case: 2 }, use: [testMiddleware] }}>
        <AgendaTitleArea roomId="1234567" isHostUser={true} />
      </SWRConfig>,
    );

    const agendaTitle = screen.queryByTestId("test-agenda-title");
    expect(agendaTitle).toBeNull();
    expect(screen.queryByRole("button", { name: "決定" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "リセット" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "結果を見る" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "もう一度" })).not.toBeNull();
    expect(screen.queryByPlaceholderText("議題を入力")).not.toBeNull();
  });
});
