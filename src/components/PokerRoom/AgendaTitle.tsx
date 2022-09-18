import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';

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
			console.log(e.target.value);
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
				/>
			</div>
			<div className="mr-4">
				<button
					className={`bg-green-500 text-white font-bold py-2 px-4 rounded ${
						isAgendaTitleSubmitDisabled
							? 'cursor-not-allowed'
							: 'pointer hover:bg-green-700'
					}`}
					onClick={handleSubmitAgendaTitle}
					disabled={isAgendaTitleSubmitDisabled}
				>
					決定
				</button>
			</div>
			<button
				className={`bg-orange-500 text-white font-bold py-2 px-4 rounded ${
					isCancelAgendaTitleDisabled
						? 'cursor-not-allowed'
						: 'pointer hover:bg-orange-700'
				}`}
				onClick={handleCancelAgendaTitle}
				disabled={isCancelAgendaTitleDisabled}
			>
				取り消し
			</button>
		</div>
	);
};
