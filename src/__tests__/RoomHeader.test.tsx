import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomHeader } from "src/components/PokerRoom/RoomHeader";
import userEvent from "@testing-library/user-event";
import singletonRouter from "next/router";
import mockRouter from "next-router-mock";

const timerGame = (callback) => {
  setTimeout(() => {
    callback();
  }, 2000);
};

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("Test RoomHeader Component", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

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

    await user.click(copyButton);
    const clickBoardText = await navigator.clipboard.readText();
    expect(clickBoardText).toBe("1234567");
  });

  test("クリップボタンを押した2秒後に画面上から「copied!」が消えること", async () => {
    jest.useFakeTimers();
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    const user = userEvent.setup();
    const copyButton = screen.getByTestId("copy-room-id");
    const copiedLabel = screen.queryByTestId("copied-label");
    expect(copiedLabel).toHaveClass("hidden");

    user.click(copyButton);
    await waitFor(() => {
      expect(copiedLabel).toHaveClass("block");
    });

    const callback = jest.fn();
    timerGame(callback);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(2000);

    expect(callback).toBeCalled();
    await waitFor(() => {
      expect(copiedLabel).toHaveClass("hidden");
    });
  });

  test("「部屋を退出する」ボタンを押すと、トップ画面に戻ること", () => {
    render(<RoomHeader roomId="1234567" isHostUser={true} userId={1} />);
    const user = userEvent.setup();
    const leaveTheRoomButton = screen.getByText("部屋を退出する");
    user.click(leaveTheRoomButton);
    expect(singletonRouter).toMatchObject({
      pathname: "/",
    });
  });
});
