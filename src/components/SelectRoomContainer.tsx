import Link from 'next/link';

export const SelectRoomContainer = () => {
	return (
		<div className="flex items-center justify-center flex-col min-h-screen">
			<div className="mb-4">
				<h2 className="text-2xl font-bold">プランニングポーカー</h2>
			</div>
			<Link href="/create-room">
				<a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center">
					部屋を作る
				</a>
			</Link>
			<Link href="/enter-room">
				<a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center">
					部屋に入る
				</a>
			</Link>
		</div>
	);
};
