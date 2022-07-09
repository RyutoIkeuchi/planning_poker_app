import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserType } from '../../types/interface';

const EnterRoom = () => {
	const [roomId, setRoomId] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const [dbUsers, setDbUsers] = useState<Array<UserType>>([]);
	const router = useRouter();

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
				router.push(`/poker-ßroom/${roomId}`);
			}
		}
	};

	const changeRoomId = (e: ChangeEvent<HTMLInputElement>) => {
		setRoomId(e.target.value);
	};

	const changeUserName = (e: ChangeEvent<HTMLInputElement>) => {
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
		<div className="flex items-center justify-center flex-col min-h-screen">
			<div className="w-full mb-4">
				<input
					type="text"
					onChange={changeUserName}
					className="border w-full p-4"
					placeholder="ユーザー名"
				/>
			</div>
			<div className="w-full mb-4">
				<input
					type="text"
					onChange={changeRoomId}
					className="border w-full p-4"
					placeholder="ルームID"
				/>
			</div>
			<div className="w-full">
				<button
					onClick={handleEnterTheRoom}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
				>
					部屋に入る
				</button>
			</div>
		</div>
	);
};

export default EnterRoom;
