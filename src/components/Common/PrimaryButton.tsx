import { ReactNode } from 'react';

type Props = {
	buttonColor: string;
	hoverButtonColor: string;
	disabled: boolean;
	handleClickMethod: () => void;
	children: ReactNode;
};

export const PrimaryButton = (props: Props) => {
	const {
		buttonColor,
		hoverButtonColor,
		disabled,
		handleClickMethod,
		children,
	} = props;
	
	return (
		<button
			className={`text-white font-bold py-2 px-4 rounded ${buttonColor} ${
				disabled ? 'cursor-not-allowed' : `pointer ${hoverButtonColor}`
			}`}
			onClick={handleClickMethod}
			disabled={disabled}
		>
			{children}
		</button>
	);
};
