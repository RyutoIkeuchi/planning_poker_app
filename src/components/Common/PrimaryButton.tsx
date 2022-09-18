import { ReactNode } from 'react';

type Props = {
	buttonColor: string;
	disabled: boolean;
	handleClickMethod: () => void;
	children: ReactNode;
};

export const PrimaryButton = (props: Props) => {
	const { buttonColor, disabled, handleClickMethod, children } = props;
	return (
		<button
			className={`text-white font-bold py-2 px-4 rounded bg-${buttonColor}-500 ${
				disabled ? 'cursor-not-allowed' : `pointer hover:bg-${buttonColor}-700`
			}`}
			onClick={handleClickMethod}
			disabled={disabled}
		>
			{children}
		</button>
	);
};
