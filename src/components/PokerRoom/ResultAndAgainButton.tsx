import { PrimaryButton } from 'src/components/Common/PrimaryButton';

type Props = {
	handleResultSelectNumber: () => void;
	isResultButtonDisabled: boolean;
	handleResetSelectCard: () => void;
	isAgainButtonDisabled: boolean;
};

export const ResultAndAgainButton = (props: Props) => {
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
					buttonColor="blue"
					handleClickMethod={handleResultSelectNumber}
					disabled={isResultButtonDisabled}
				>
					結果を見る
				</PrimaryButton>
			</div>
			<div>
				<PrimaryButton
					buttonColor="gray"
					handleClickMethod={handleResetSelectCard}
					disabled={isAgainButtonDisabled}
				>
					もう一度
				</PrimaryButton>
			</div>
		</div>
	);
};
