import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const SelectRoomContainer = () => {
	const [roomId, setRoomId] = useState();
	const [roomIdToLocalStorage, setRoomIdToLocalStorage] = useState();
	const router = useRouter();

	const createRoomId = () => {
		let randomId = Math.floor(Math.random() * 1000000);
		while (randomId.toString().length != 6) {
			randomId = Math.floor(Math.random() * 1000000);
		}
		console.log(randomId);
		localStorage.setItem('ROOM_ID', randomId.toString());
		setRoomIdToLocalStorage(randomId);
	};

	const enterTheRoom = () => {
		console.log(roomId);
		console.log(roomIdToLocalStorage);
		if (roomId === roomIdToLocalStorage) {
			router.push('/poker_room');
		}
	};

	const changeRoomId = (e) => {
		setRoomId(e.target.value);
	};

	useEffect(() => {
		const roomId = localStorage.getItem('ROOM_ID');
		setRoomIdToLocalStorage(roomId);
	}, []);

	return (
		<div>
			<p>{roomIdToLocalStorage}</p>
			<button onClick={createRoomId}>部屋を作る</button>
			<input type="text" onChange={changeRoomId} className="border" />
			<button onClick={enterTheRoom} className="text-blue-400">
				部屋に入る
			</button>
		</div>
	);
};
