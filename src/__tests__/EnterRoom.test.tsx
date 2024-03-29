import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnterRoom from "src/pages/enter-room";
import userEvent from "@testing-library/user-event";
import singletonRouter, { useRouter } from "next/router";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("<EnterRoom />", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
    render(<EnterRoom />);
  });

  test("画面内にボタンが一つあること", async () => {
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });

  test("ボタンのラベルは「部屋に入る」であること", () => {
    expect(screen.getByText("部屋に入る")).toBeInTheDocument();
  });

  test("room_idを入力するinputがあって、値を入力すると値を反映してくれること", async () => {
    const inputRoomId: HTMLInputElement = await screen.findByTestId("input-roomid");
    await userEvent.type(inputRoomId, "1234567");
    expect(inputRoomId.value).toBe("1234567");
  });

  // TODO: 要改善
  test("ログインしていないユーザー", async () => {
    const enterRoomButton = screen.getByText("部屋に入る");
    const inputRoomId: HTMLInputElement = await screen.findByTestId("input-roomid");
    await userEvent.type(inputRoomId, "1234567");
    await act(async () => {
      await singletonRouter.push("/poker-room/1234567");
    });
    expect(singletonRouter).toMatchObject({
      pathname: "/poker-room/1234567",
    });
  });
});
