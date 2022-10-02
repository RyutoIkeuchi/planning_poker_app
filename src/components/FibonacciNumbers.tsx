type Props = {
  handleOpenConfirmModal: (selectCard: string) => void;
  isSelectNumberCard: boolean;
};

const FIBONACCI_NUMBERS = [...Array(11)].map((d, i) => {
  const generateFibonacci = (num: number): number => {
    if (num < 2) {
      return num;
    } else {
      return generateFibonacci(num - 1) + generateFibonacci(num - 2);
    }
  };
  return i === 0 ? "/" : generateFibonacci(i + 1).toString();
});

export const FibonacciNumbers = ({ handleOpenConfirmModal, isSelectNumberCard }: Props) => {
  return (
    <ul className="flex justify-start mb-4">
      {FIBONACCI_NUMBERS.map((d, i) => {
        return (
          <li key={i}>
            <button
              className={`border ${
                isSelectNumberCard
                  ? "cursor-not-allowed bg-gray-200 shadow-none border-gray-200"
                  : "hover:transform hover:duration-500 hover:-translate-y-5 shadow-lg border-gray-600"
              } mb-4 mr-4`}
              onClick={() => handleOpenConfirmModal(d)}
              disabled={isSelectNumberCard}
            >
              <div className="w-20 h-28 flex justify-center items-center">
                <p className="text-3xl">{d}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
