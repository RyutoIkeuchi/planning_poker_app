import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnterRoom from "src/pages/enter-room";
import userEvent from "@testing-library/user-event";

describe("Test EnterRoom Component", () => {
  test("Navigator form with 1 button", async () => {
    render(<EnterRoom />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });

  test("Navigator 1 button label", () => {
    render(<EnterRoom />);
    expect(screen.getByText("部屋に入る")).toBeInTheDocument();
  });

  test("Input check Room Id", async () => {
    render(<EnterRoom />);
    const inputRoomId: HTMLInputElement = await screen.findByTestId("input-roomid");
    await userEvent.type(inputRoomId, "1234567");
    expect(inputRoomId.value).toBe("1234567");
  });
});
