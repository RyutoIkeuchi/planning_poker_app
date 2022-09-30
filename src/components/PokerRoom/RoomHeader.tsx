import { PrimaryButton } from 'src/components/Common/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRightFromBracket,
	faPaperclip,
	faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { useCallback, useState } from 'react';

type Props = {
	roomId: string;
	handleLeaveTheRoom: () => Promise<void>;
};

export const RoomHeader = (props: Props) => {
	const { roomId, handleLeaveTheRoom } = props;
	const [isCopiedText, setIsCopiedText] = useState<boolean>(false);

	const handleCopyRoomId = useCallback(() => {
		navigator.clipboard.writeText(roomId);
		setIsCopiedText(true);
		setTimeout(() => {
			setIsCopiedText(false);
		}, 2000);
	}, [roomId]);

	return (
		<div className="my-6 flex justify-between items-center">
			<div className="flex items-center justify-start">
				<h2 className="mr-2">
					Room ID : <span className="font-bold text-xl">{roomId}</span>
				</h2>
				<button onClick={handleCopyRoomId}>
					<FontAwesomeIcon icon={faPaperclip} />
				</button>
				<div
					className={`bg-white border p-2 rounded shadow-md ml-4 flex items-center justify-center ${
						isCopiedText ? 'block' : 'hidden'
					} `}
				>
					<FontAwesomeIcon icon={faThumbsUp} className="text-yellow-500 mr-2" />
					<p className="text-sm">copied!</p>
				</div>
			</div>
			<PrimaryButton
				buttonColor="bg-red-500"
				hoverButtonColor="hover:bg-red-700"
				handleClickMethod={handleLeaveTheRoom}
				disabled={false}
			>
				<FontAwesomeIcon icon={faRightFromBracket} />
				<span className="ml-2">部屋を退出する</span>
			</PrimaryButton>
		</div>
	);
};
