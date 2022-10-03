import { FIBONACCI_NUMBERS } from "src/utils/constants";

type Props = {
  canSelectNumberCard: boolean;
  handleOpenConfirmModal: (selectCard: string) => void;
};

export const FibonacciNumbers = (props: Props) => {
  const { canSelectNumberCard, handleOpenConfirmModal } = props;

  return (
    <ul className="flex justify-start mb-4">
      {FIBONACCI_NUMBERS.map((d, i) => {
        return (
          <li key={i}>
            <button
              className={`border ${
                canSelectNumberCard
                  ? "hover:transform hover:duration-500 hover:-translate-y-5 shadow-lg border-gray-600"
                  : "cursor-not-allowed bg-gray-200 shadow-none border-gray-200"
              } mb-4 mr-4`}
              onClick={() => handleOpenConfirmModal(d)}
              disabled={!canSelectNumberCard}
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
