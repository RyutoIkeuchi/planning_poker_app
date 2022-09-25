import { PrimaryButton } from 'src/components/Common/PrimaryButton';

export type ResultAndAgainButtonProps = {
	handleResultSelectNumber: () => void;
	isResultButtonDisabled: boolean;
	handleResetSelectCard: () => void;
	isAgainButtonDisabled: boolean;
};

export const ResultAndAgainButton = (props: ResultAndAgainButtonProps) => {
	const {
		handleResultSelectNumber,
		isResultButtonDisabled,
		handleResetSelectCard,
		isAgainButtonDisabled,
	} = props;

	return (
		<div className="flex justify-start">
			<div className="mr-4">
				<PrimaryButton
					buttonColor="bg-blue-500"
					hoverButtonColor="hover:bg-blue-700"
					handleClickMethod={handleResultSelectNumber}
					disabled={isResultButtonDisabled}
				>
					結果を見る
				</PrimaryButton>
			</div>
			<div>
				<PrimaryButton
					buttonColor="bg-gray-500"
					hoverButtonColor="hover:bg-gray-700"
					handleClickMethod={handleResetSelectCard}
					disabled={isAgainButtonDisabled}
				>
					もう一度
				</PrimaryButton>
			</div>
		</div>
	);
};
