import { Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type Props = {
	selectCard: string;
	socket: Socket<DefaultEventsMap, DefaultEventsMap>;
	roomId: string;
	userName: string;
	setIsConfirmModal: Dispatch<SetStateAction<boolean>>;
	setIsSelectNumberCard: Dispatch<SetStateAction<boolean>>;
};

export const ConfirmSelectNumberModal = ({
	selectCard,
	socket,
	roomId,
	userName,
	setIsConfirmModal,
	setIsSelectNumberCard,
}: Props) => {
	const handleSubmitSelectNumber = () => {
		socket.emit('send_select_number', {
			room_id: roomId,
			user_name: userName,
			select_card: selectCard,
		});
		setIsConfirmModal(false);
		setIsSelectNumberCard(true);
	};

	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="relative w-auto my-6 max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-64 bg-white outline-none focus:outline-none h-96">
						<div className="flex justify-between items-center py-1 px-2 border-b">
							<button onClick={() => setIsConfirmModal(false)}>
								<FontAwesomeIcon icon={faXmark} />
							</button>
							<button
								className="text-blue-600 font-bold text-sm hover:text-blue-400 p-2"
								type="button"
								onClick={handleSubmitSelectNumber}
							>
								送信する
							</button>
						</div>
						<div className="mx-auto h-full flex items-center">
							<p className="text-6xl">{selectCard}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</>
	);
};
