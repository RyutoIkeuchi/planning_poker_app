import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';
import { PrimaryButton } from 'src/components/Common/PrimaryButton';

type Props = {
	agendaTitle: string;
	setAgendaTitle: Dispatch<SetStateAction<string>>;
	handleSubmitAgendaTitle: () => void;
	isAgendaTitleSubmitDisabled: boolean;
	setIsAgendaTitleSubmitDisabled: Dispatch<SetStateAction<boolean>>;
	handleCancelAgendaTitle: () => void;
	isCancelAgendaTitleDisabled: boolean;
};

export const AgendaTitle = (props: Props) => {
	const {
		agendaTitle,
		setAgendaTitle,
		handleSubmitAgendaTitle,
		isAgendaTitleSubmitDisabled,
		setIsAgendaTitleSubmitDisabled,
		handleCancelAgendaTitle,
		isCancelAgendaTitleDisabled,
	} = props;

	const handleChangeAgendaTitle = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const inputAgendaTitle = e.target.value;
			setAgendaTitle(inputAgendaTitle);
			if (inputAgendaTitle !== '') {
				setIsAgendaTitleSubmitDisabled(false);
			} else {
				setIsAgendaTitleSubmitDisabled(true);
			}
		},
		[]
	);

	return (
		<div className="flex justify-start items-center w-2/3">
			<div className="mr-4 w-1/2">
				<input
					type="text"
					value={agendaTitle}
					className="border p-2 w-full rounded"
					onChange={handleChangeAgendaTitle}
					placeholder='議題を入力'
				/>
			</div>
			<div className="mr-4">
				<PrimaryButton
					buttonColor="green"
					handleClickMethod={handleSubmitAgendaTitle}
					disabled={isAgendaTitleSubmitDisabled}
				>
					決定
				</PrimaryButton>
			</div>
			<PrimaryButton
				buttonColor="orange"
				handleClickMethod={handleCancelAgendaTitle}
				disabled={isCancelAgendaTitleDisabled}
			>
				取り消し
			</PrimaryButton>
		</div>
	);
};
