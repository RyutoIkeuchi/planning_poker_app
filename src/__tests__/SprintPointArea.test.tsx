import { render, screen } from "@testing-library/react";
import { SWRConfig } from "swr";
import { SprintPointArea } from "src/components/PokerRoom/SprintPointArea";
import "@testing-library/jest-dom";
import { testMiddleware} from "src/__mocks__/useSwr";

describe("Test SprintPointArea Component", () => {
  test("Result時、/を除いた値の平均値を計算してくれること", () => {
    render(
      <SWRConfig value={{ fallback: { case: 2 }, use: [testMiddleware] }}>
        <SprintPointArea roomId="1234567" />
      </SWRConfig>,
    );
    const sprintPointResult = screen.queryByTestId("sprint-point-result");
    expect(sprintPointResult.innerHTML).toBe("4.25");
  });

  test("Reset時、一律で?を表示すること", () => {
    render(
      <SWRConfig value={{ fallback: { case: 1 }, use: [testMiddleware] }}>
        <SprintPointArea roomId="1234567" />
      </SWRConfig>,
    );
    const sprintPointResult = screen.queryByTestId("sprint-point-result");
    expect(sprintPointResult.innerHTML).toBe("?");
  });
});
