import { PrimaryButton } from 'src/components/Common/PrimaryButton';

type Props = {
	roomId: string;
	handleLeaveTheRoom: () => Promise<void>;
};

export const RoomHeader = (props: Props) => {
	const { roomId, handleLeaveTheRoom } = props;

	return (
		<div className="my-6 flex justify-between items-center">
			<h2>
				Room ID : <span className="font-bold text-xl">{roomId}</span>
			</h2>
			<PrimaryButton
				buttonColor="bg-red-500"
				hoverButtonColor="hover:bg-red-700"
				handleClickMethod={handleLeaveTheRoom}
				disabled={false}
			>
				部屋を退出する
			</PrimaryButton>
		</div>
	);
};
