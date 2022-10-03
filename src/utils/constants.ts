export const FIBONACCI_NUMBERS = [...Array(11)].map((d, i) => {
  const generateFibonacci = (num: number): number => {
    if (num < 2) {
      return num;
    } else {
      return generateFibonacci(num - 1) + generateFibonacci(num - 2);
    }
  };
  return i === 0 ? "/" : generateFibonacci(i + 1).toString();
});
