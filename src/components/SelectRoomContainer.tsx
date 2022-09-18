import Link from 'next/link';
import EnterRoomIcon from 'public/images/EnterRoom_Flatline.svg';
import CreateRoomIcon from 'public/images/CreateRoom_Flatline.svg';

export const SelectRoomContainer = () => {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="flex justify-between w-full">
				<div>
					<div className="mb-4">
						<CreateRoomIcon />
					</div>
					<Link href="/create-room">
						<a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
							部屋を作る
						</a>
					</Link>
				</div>
				<div className="h-auto border border-blue-700"></div>
				<div>
					<div className="mb-4">
						<EnterRoomIcon />
					</div>
					<div className="w-full">
						<Link href="/enter-room">
							<a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
								部屋に入る
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
