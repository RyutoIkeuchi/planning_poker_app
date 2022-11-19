let percent = 0;
const interval = () => {
  setInterval(() => {
    percent += 10;
  }, 500);
};

describe("Test CreateRoom Component", () => {
  test("Rising percent speed test", async () => {
    jest.useFakeTimers();
    interval();

    expect(percent).toBe(0);

    jest.advanceTimersByTime(500);
    expect(percent).toBe(10);

    jest.advanceTimersByTime(5000);
    expect(percent).toBe(110);
  });
});

export {};
