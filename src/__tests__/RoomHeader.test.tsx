import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import userEvent from "@testing-library/user-event";

describe("Test RoomHeader Component", () => {
  test("画面内にボタンが二つあること", async () => {
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(2);
  });

  test("2つのボタンのうち、ラベルの一つが「部屋を退出する」であること", () => {
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    expect(screen.getByText("部屋を退出する")).toBeInTheDocument();
  });

  test("ヘッダーのIDが親コンポーネントから渡ってきたRoom IDであること", () => {
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    const headerRoomId = screen.getByTestId("header-room-id");
    expect(headerRoomId.textContent).toBe("1234567");
  });

  test("クリップボタンを押すと、Room IDがコピーされること", async () => {
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    const user = userEvent.setup();
    const copyButton = screen.getByTestId("copy-room-id");
    const copiedLabel = screen.queryByTestId("copied-label");
    expect(copiedLabel).toHaveClass("hidden");

    await user.click(copyButton);
    const clickBoardText = await navigator.clipboard.readText();
    expect(clickBoardText).toBe("1234567");
    expect(copiedLabel).toHaveClass("block");
  });
});
