import Link from 'next/link';
import EnterRoomIcon from 'public/images/EnterRoom_Flatline.svg';
import CreateRoomIcon from 'public/images/CreateRoom_Flatline.svg';
import { Footer } from 'src/components/Footer';

type RoomContentType = {
	icon: React.ReactElement;
	href: string;
	linkLabel: string;
};

export const SelectRoomContainer = () => {
	return (
		<>
			<div className="flex justify-center items-center min-h-screen">
				<div className="flex justify-between w-full">
					<RoomContent
						icon={<CreateRoomIcon />}
						href="/create-room"
						linkLabel="部屋を作る"
					/>
					<div className="h-auto border border-blue-700"></div>
					<RoomContent
						icon={<EnterRoomIcon />}
						href="/enter-room"
						linkLabel="部屋に入る"
					/>
				</div>
			</div>
			<Footer />
		</>
	);
};

const RoomContent = (props: RoomContentType) => {
	const { icon, href, linkLabel } = props;
	return (
		<div>
			<div className="mb-4">{icon}</div>
			<Link href={href}>
				<a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 text-center block">
					{linkLabel}
				</a>
			</Link>
		</div>
	);
};
