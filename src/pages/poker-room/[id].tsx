import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserType } from '../../types/interface';

const PokerRoom = () => {
	const router = useRouter();
	const [queryId, setQueryId] = useState('');
	const [roomDataToLocalStorage, setRoomDataToLocalStorage] =
		useState<UserType>();
	const [users, setUsers] = useState<Array<UserType>>([]);

	const checkRoomId = async (queryId: string) => {
		if (roomDataToLocalStorage?.owner_id != queryId) {
			router.replace('/');
		}
		try {
			const response = await axios.get(
				`http://localhost:8000/pokers/${queryId}`
			);
			setUsers(response.data.users);
		} catch (error) {
			if ((error as AxiosError).response?.status == 404) {
				console.log('部屋が見つかりません');
				router.push('/');
			}
		}
	};

	const getRoomDataToLocalStorage = () => {
		const response = localStorage.getItem('ROOM_DATA');
		if (typeof response == 'string') {
			setRoomDataToLocalStorage(JSON.parse(response));
		}
	};

	const handleLeaveTheRoom = async () => {
		localStorage.removeItem('ROOM_DATA');
		const response = await axios.delete(
			`http://localhost:8000/users/${roomDataToLocalStorage?.id}`
		);
		if (response.status == 204) {
			router.push('/');
		}
	};

	useEffect(() => {
		if (router.asPath !== router.route) {
			if (router.query.id != undefined) {
				const queryId = router.query.id as string;
				setQueryId(queryId);
			}
		}
	}, [router]);

	useEffect(() => {
		getRoomDataToLocalStorage();
		if (queryId) {
			checkRoomId(queryId);
		}
	}, [queryId]);

	return (
		<div>
			<div className="my-6 flex justify-between items-center">
				<h3 className="">
					Room ID : <span className="font-bold text-xl">{router.query.id}</span>
				</h3>
				<button
					onClick={handleLeaveTheRoom}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					部屋を退出する
				</button>
			</div>
			<ul className="flex justify-start">
				{users.map((user) => {
					if (roomDataToLocalStorage?.name == user.name) {
						return (
							<li key={user.id} className="text-red-600">
								<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
									<p className="text-3xl">?</p>
								</div>
								<p className="text-center">{user.name}</p>
							</li>
						);
					}
					return (
						<li key={user.id}>
							<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
								<p className="text-3xl">?</p>
							</div>
							<p className="text-center">{user.name}</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default PokerRoom;
