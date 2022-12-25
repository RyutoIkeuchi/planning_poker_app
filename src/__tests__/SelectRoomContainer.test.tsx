import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SelectRoomContainer } from "src/components/Root/SelectRoomContainer";
import userEvent from "@testing-library/user-event";
import singletonRouter from "next/router";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("<SelectRoomContainer />", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
    render(<SelectRoomContainer />);
  });

  test("画面内にボタンが二つあること", async () => {
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(2);
  });

  test("2つのボタンのラベルが「部屋を作る」と「部屋に入る」であること", () => {
    expect(screen.getByText("部屋を作る")).toBeInTheDocument();
    expect(screen.getByText("部屋に入る")).toBeInTheDocument();
  });

  test("「部屋を作る」ボタンをクリックすると、confirmモーダルが出てくること", async () => {
    const spyWindowConfirm = jest.spyOn(window, "confirm");
    spyWindowConfirm.mockImplementation(jest.fn());
    await userEvent.click(screen.getByText("部屋を作る"));
    expect(spyWindowConfirm).toHaveBeenCalledTimes(1);
  });

  test("「部屋に入る」ボタンをクリックすると、部屋に入るためのRoom ID入力画面に遷移する", async () => {
    const user = userEvent.setup();
    const enterTheRoomButton = screen.getByText("部屋に入る");
    await user.click(enterTheRoomButton);
    expect(singletonRouter).toMatchObject({
      pathname: "/enter-room",
    });
  });
});
