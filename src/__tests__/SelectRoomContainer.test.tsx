import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SelectRoomContainer } from "src/components/Root/SelectRoomContainer";

describe("Test SelectRoomContainer Component", () => {
  test("navigator form with 2 button", async () => {
    render(<SelectRoomContainer />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(2);
  });
});

const add = (a, b) => a + b;

describe("Sample unit test.", () => {
  test("1 + 2 = 3", () => {
    expect(add(1, 2)).toBe(3);
  });
});
