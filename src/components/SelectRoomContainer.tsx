import Link from 'next/link';
import EnterRoomIcon from '../../public/images/EnterRoom_Flatline.svg';
import CreateRoomIcon from '../../public/images/CreateRoom_Flatline.svg';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

export const SelectRoomContainer = () => {
	const [message, setMessage] = useState('');
	const didLogRef = useRef(false);
	
	const socket = io('ws://localhost:8000', {
		path: '/ws/socket.io/',
		transports: ['websocket', 'polling'],
	});

	const handleSubmit = () => {
		socket.emit('send_message', { message: message });
	};


	useEffect(() => {
		if (didLogRef.current === false) {
			didLogRef.current = true;
			socket.on('connect', () => {
				console.log('Connected', socket.id);

				socket.on('response', (data) => {
					console.log('Response', socket.id);
					console.log(data);
				});
			});
		} else {
			didLogRef.current = false;
		}

		return () => {
			if (didLogRef.current === false) {
				socket.disconnect();
			}
		};
	}, []);

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div>
				<input type="text" onChange={(e) => setMessage(e.target.value)} />
				<button onClick={handleSubmit}>送信</button>
				<button onClick={() => socket.disconnect()}>削除</button>
			</div>
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
