import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnterRoom from "src/pages/enter-room";
import userEvent from "@testing-library/user-event";

describe("<EnterRoom />", () => {
  test("画面内にボタンが一つあること", async () => {
    render(<EnterRoom />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });

  test("ボタンのラベルは「部屋に入る」であること", () => {
    render(<EnterRoom />);
    expect(screen.getByText("部屋に入る")).toBeInTheDocument();
  });

  test("room_idを入力するinputがあって、値を入力すると値を反映してくれること", async () => {
    render(<EnterRoom />);
    const inputRoomId: HTMLInputElement = await screen.findByTestId("input-roomid");
    await userEvent.type(inputRoomId, "1234567");
    expect(inputRoomId.value).toBe("1234567");
  });
});
