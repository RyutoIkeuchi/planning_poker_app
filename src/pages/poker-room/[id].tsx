import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { UserType } from '../../types/interface';
import io from 'socket.io-client';
import { api } from '../../service/api';
import { ConfirmSelectNumberModal } from '../../components/ConfirmSelectNumberModal';
import { FibonacciNumbers } from '../../components/FibonacciNumbers';

const PokerRoom = () => {
	const router = useRouter();
	const [queryId, setQueryId] = useState('');
	const [roomDataToLocalStorage, setRoomDataToLocalStorage] =
		useState<UserType>();
	const [myRoomUsers, setMyRoomUsers] = useState<Array<UserType>>([]);
	const [newMyRoomUser, setNewMyRoomUser] = useState<UserType>();
	const [newSelectCard, setNewSelectCard] = useState<UserType>();
	const [isConfirmModal, setIsConfirmModal] = useState(false);
	const [selectCard, setSelectCard] = useState('');

	const [message, setMessage] = useState('');
	const didLogRef = useRef(false);

	const socket = io('http://localhost:4000');

	const handleSubmit = () => {
		socket.emit('send_message', { message: message, room_id: queryId });
	};

	useEffect(() => {
		if (didLogRef.current === false) {
			didLogRef.current = true;
			socket.on('connect', () => {
				console.log('接続したよ！');
				socket.emit('join', {
					room_id: roomDataToLocalStorage?.owner_id,
					user_name: roomDataToLocalStorage?.name,
				});

				socket.on('add_user_response', (data) => {
					console.log('user', data);
					setNewMyRoomUser({ name: data.user_name, owner_id: data.room_id });
				});

				socket.on('select_number_response', (data) => {
					console.log('選んだ番号が送信されました', data);
					setNewSelectCard({
						name: data.user_name,
						owner_id: data.room_id,
						select_card: data.select_card,
					});
				});

				socket.on('message_response', (data) => {
					console.log('メッセージが送信されました', data);
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
	}, [roomDataToLocalStorage]);

	useEffect(() => {
		if (
			newMyRoomUser &&
			!myRoomUsers.some((user) => user.name === newMyRoomUser.name)
		) {
			setMyRoomUsers([...myRoomUsers, newMyRoomUser]);
		}
	}, [newMyRoomUser]);

	useEffect(() => {
		if (newSelectCard) {
			const upDataMyRoomUserStatus = myRoomUsers.map((user) => {
				if (user.name === newSelectCard.name) {
					return { ...user, select_card: newSelectCard.select_card };
				}
				return user;
			});
			setMyRoomUsers(upDataMyRoomUserStatus);
		}
	}, [newSelectCard]);

	const checkRoomId = async (queryId: string) => {
		if (roomDataToLocalStorage?.owner_id != queryId) {
			router.replace('/');
		}
		try {
			const response = await api.get(`/pokers/${queryId}`);
			setMyRoomUsers(response.data.users);
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
		const response = await api.delete(
			`/pokers/${roomDataToLocalStorage?.owner_id}/users/${roomDataToLocalStorage?.id}`
		);
		if (response.status == 204) {
			if (myRoomUsers.length == 1) {
				return await handleDeleteRoom();
			}
			router.push('/');
		}
	};

	const handleDeleteRoom = async () => {
		const response = await api.delete(`/pokers/${queryId}`);
		if (response.status == 204) {
			router.push('/');
		}
	};

	const handleOpenConfirmModal = (selectCard: string) => {
		setIsConfirmModal(true);
		setSelectCard(selectCard);
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
			<div className="mb-10">
				<div className="mb-4">
					<p className="text-xl">カードを選択</p>
				</div>
				<FibonacciNumbers handleOpenConfirmModal={handleOpenConfirmModal} />
				<hr />
			</div>
			{isConfirmModal && (
				<ConfirmSelectNumberModal
					selectCard={selectCard}
					socket={socket}
					roomId={queryId}
					userName={roomDataToLocalStorage?.name || ''}
					setIsConfirmModal={setIsConfirmModal}
				/>
			)}
			<div>
				<input type="text" onChange={(e) => setMessage(e.target.value)} />
				<button onClick={handleSubmit}>送信</button>
				<button onClick={() => socket.disconnect()}>削除</button>
			</div>
			<ul className="flex justify-start">
				{myRoomUsers.map((user) => {
					if (roomDataToLocalStorage?.name == user.name) {
						return (
							<li key={user.name} className="text-red-600">
								<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
									<p className="text-3xl">{user.select_card || '?'}</p>
								</div>
								<p className="text-center">{user.name}</p>
							</li>
						);
					}
					return (
						<li key={user.name}>
							<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
								<p className="text-3xl">{user.select_card || '?'}</p>
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
