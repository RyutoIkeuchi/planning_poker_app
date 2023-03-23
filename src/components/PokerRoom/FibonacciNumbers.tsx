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
      {FIBONACCI_NUMBERS.map((d) => {
        return (
          <li key={d}>
            <button
              className={`${
                canSelectNumberCard
                  ? "hover:transform hover:duration-500 hover:-translate-y-5 shadow-lg"
                  : "cursor-not-allowed bg-gray-400 shadow-none border-gray-400"
              }`}
              tw="border mb-4 mr-4 bg-white"
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
