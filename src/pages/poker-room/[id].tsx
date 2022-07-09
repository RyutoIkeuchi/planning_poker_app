import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LocalStorageRoomDataType, UserType } from '../../types/interface';

const PokerRoom = () => {
	const router = useRouter();
	const [queryId, setQueryId] = useState('');
	const [roomDataToLocalStorage, setRoomDataToLocalStorage] =
		useState<LocalStorageRoomDataType>();
	const [users, setUsers] = useState<Array<UserType>>([]);

	const checkRoomId = async (queryId: string) => {
		if (roomDataToLocalStorage?.room_id != queryId) {
			console.log('あ');
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
			`http://localhost:8000/pokers/${queryId}`
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
			<h1>プランニングポーカー{router.query.id}</h1>
			<button onClick={handleLeaveTheRoom}>部屋を退出する</button>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	);
};

export default PokerRoom;
