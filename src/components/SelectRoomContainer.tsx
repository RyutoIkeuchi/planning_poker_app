import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserType } from '../types/interface';

export const SelectRoomContainer = () => {
	const [roomId, setRoomId] = useState();
	const [userName, setUserName] = useState('');
	const [dbUsers, setDbUsers] = useState<Array<UserType>>([]);
	const router = useRouter();

	const handleCreateRoomId = async () => {
		const data = {
			name: userName,
		};
		const response = await axios.post('http://localhost:8000/pokers', data, {
			headers: { 'content-type': 'application/json' },
		});
		if (response.status == 200) {
			console.log(response.data);
			const roomData = { room_id: response.data.room_id, name: userName };
			localStorage.setItem('ROOM_DATA', JSON.stringify(roomData));
			router.push(`/poker_room/${response.data.room_id}`);
		}
	};

	const handleEnterTheRoom = async () => {
		const sameName = dbUsers.find((user) => user.name == userName);
		if (sameName == undefined) {
			const data = {
				room_id: roomId,
				name: userName,
			};
			const response = await axios.post('http://localhost:8000/users', data, {
				headers: { 'content-type': 'application/json' },
			});
			if (response.status == 200) {
				localStorage.setItem('ROOM_DATA', JSON.stringify(data));
				router.push(`/poker_room/${roomId}`);
			}
		}
	};

	const changeRoomId = (e) => {
		setRoomId(e.target.value);
	};

	const changeUserName = (e) => {
		setUserName(e.target.value);
	};

	const getUsers = async () => {
		const response = await axios.get('http://localhost:8000/users');
		setDbUsers(response.data);
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<div>
			<div>
				<input
					type="text"
					onChange={changeUserName}
					className="border"
					placeholder="ユーザー名"
				/>
				<input
					type="text"
					onChange={changeRoomId}
					className="border"
					placeholder="ルームID"
				/>
			</div>
			<div>
				<button onClick={handleCreateRoomId}>部屋を作る</button>
				<button onClick={handleEnterTheRoom} className="text-blue-400">
					部屋に入る
				</button>
			</div>
		</div>
	);
};
