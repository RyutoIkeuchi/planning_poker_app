import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const SelectRoomContainer = () => {
	const [roomId, setRoomId] = useState();
	const [userName, setUserName] = useState('');
	const [pokersToLocalStorage, setPokersToLocalStorage] = useState([]);
	const router = useRouter();

	const createRoomId = () => {
		let randomId = Math.floor(Math.random() * 1000000);
		while (randomId.toString().length != 6) {
			randomId = Math.floor(Math.random() * 1000000);
		}

		const newPokerRoom = JSON.stringify([
			...pokersToLocalStorage,
			{ room_id: randomId, users: [userName] },
		]);

		localStorage.setItem('PLANNING_POKER', newPokerRoom);
		router.push('/poker_room');
	};

	const enterTheRoom = () => {
		if (pokersToLocalStorage.some((poker) => poker.room_id == roomId)) {
			router.push('/poker_room');
		}
	};

	const changeRoomId = (e) => {
		setRoomId(e.target.value);
	};

	const changeUserName = (e) => {
		setUserName(e.target.value);
	};

	useEffect(() => {
		const json = localStorage.getItem('PLANNING_POKER');
		if (json != null) {
			setPokersToLocalStorage(JSON.parse(json));
		}
		console.log(localStorage.getItem('PLANNING_POKER'));
	}, []);

	return (
		<div>
			<button onClick={createRoomId}>部屋を作る</button>
			<input type="text" onChange={changeUserName} className="border" />
			<input type="text" onChange={changeRoomId} className="border" />
			<button onClick={enterTheRoom} className="text-blue-400">
				部屋に入る
			</button>
		</div>
	);
};
