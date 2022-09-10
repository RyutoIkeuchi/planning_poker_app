type Props = {
	handleOpenConfirmModal: (selectCard: string) => void;
};

const FIBONACCI_NUMBERS = [...Array(11)].map((d, i) => {
	const generateFibonacci = (num: number): number => {
		if (num < 2) {
			return num;
		} else {
			return generateFibonacci(num - 1) + generateFibonacci(num - 2);
		}
	};
	return i === 0 ? '/' : generateFibonacci(i + 1).toString();
});

export const FibonacciNumbers = ({ handleOpenConfirmModal }: Props) => {
	return (
		<ul className="flex justify-start mb-4">
			{FIBONACCI_NUMBERS.map((d, i) => {
				return (
					<li key={i}>
						<button
							className="hover:transform hover:duration-500 hover:-translate-y-5"
							onClick={() => handleOpenConfirmModal(d)}
						>
							<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
								<p className="text-3xl">{d}</p>
							</div>
						</button>
					</li>
				);
			})}
		</ul>
	);
};
