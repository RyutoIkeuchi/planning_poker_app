import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import EnterRoomIcon from '../../../public/images/EnterRoom_Flatline.svg';

const EnterRoom = () => {
	const [roomId, setRoomId] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const router = useRouter();

	const handleEnterTheRoom = async () => {
		const data = {
			name: userName,
		};
		const response = await axios.post(
			`http://localhost:8000/pokers/${roomId}/users`,
			data,
			{
				headers: { 'content-type': 'application/json' },
			}
		);
		if (response.status == 200) {
			localStorage.setItem('ROOM_DATA', JSON.stringify(response.data));
			router.push(`/poker-room/${roomId}`);
		}
	};

	const changeRoomId = (e: ChangeEvent<HTMLInputElement>) => {
		setRoomId(e.target.value);
	};

	const changeUserName = (e: ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
	};

	return (
		<div className="flex items-center justify-center flex-col max-w-xl mx-auto min-h-screen">
			<div className="mb-10">
				<EnterRoomIcon />
			</div>
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
