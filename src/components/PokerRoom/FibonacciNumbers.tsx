import { FIBONACCI_NUMBERS } from "src/utils/constants";
import tw, { css } from "twin.macro";

type Props = {
  canSelectNumberCard: boolean;
  handleOpenConfirmModal: (selectCard: string) => void;
};

export const FibonacciNumbers = (props: Props) => {
  const { canSelectNumberCard, handleOpenConfirmModal } = props;

  return (
    <ul tw="flex justify-start mb-4">
      {FIBONACCI_NUMBERS.map((d, i) => {
        return (
          <li key={i}>
            <button
              className={`${
                canSelectNumberCard
                  ? "hover:transform hover:duration-500 hover:-translate-y-5 shadow-lg border-gray-600"
                  : "cursor-not-allowed bg-gray-200 shadow-none border-gray-200"
              }`}
              tw="border mb-4 mr-4"
              onClick={() => handleOpenConfirmModal(d)}
              disabled={!canSelectNumberCard}
            >
              <div tw="w-20 h-28 flex justify-center items-center">
                <p tw="text-3xl">{d}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
