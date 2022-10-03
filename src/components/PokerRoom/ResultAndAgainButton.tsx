import { PrimaryButton } from "src/components/Common/PrimaryButton";

export type ResultAndAgainButtonProps = {
  handleAgainSelectNumberCard: () => void;
  handleResultSelectNumberCard: () => void;
  isAgainButtonDisabled: boolean;
  isResultButtonDisabled: boolean;
};

export const ResultAndAgainButton = (props: ResultAndAgainButtonProps) => {
  const {
    handleAgainSelectNumberCard,
    handleResultSelectNumberCard,
    isAgainButtonDisabled,
    isResultButtonDisabled,
  } = props;

  return (
    <div className="flex justify-start">
      <div className="mr-4">
        <PrimaryButton
          buttonColor="bg-blue-500"
          hoverButtonColor="hover:bg-blue-700"
          handleClickMethod={handleResultSelectNumberCard}
          disabled={isResultButtonDisabled}
        >
          結果を見る
        </PrimaryButton>
      </div>
      <div>
        <PrimaryButton
          buttonColor="bg-gray-500"
          hoverButtonColor="hover:bg-gray-700"
          handleClickMethod={handleAgainSelectNumberCard}
          disabled={isAgainButtonDisabled}
        >
          もう一度
        </PrimaryButton>
      </div>
    </div>
  );
};
