import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SelectCardUserType, UserType } from '../../types/interface';
import io from 'socket.io-client';
import { api } from '../../service/api';
import { ConfirmSelectNumberModal } from '../../components/ConfirmSelectNumberModal';
import { FibonacciNumbers } from '../../components/FibonacciNumbers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';

const PokerRoom = () => {
	const router = useRouter();
	const [queryId, setQueryId] = useState('');
	const [roomDataToLocalStorage, setRoomDataToLocalStorage] =
		useState<UserType>();
	const [myRoomUsers, setMyRoomUsers] = useState<Array<UserType>>([]);
	const [newMyRoomUser, setNewMyRoomUser] = useState<UserType>();
	const [newSelectCard, setNewSelectCard] = useState<SelectCardUserType>();
	const [newAgendaTitle, setNewAgendaTitle] = useState<string>('');
	const [isConfirmModal, setIsConfirmModal] = useState(false);
	const [selectCard, setSelectCard] = useState('');
	const [isAgendaTitleSubmitDisabled, setIsAgendaTitleSubmitDisabled] =
		useState<boolean>(false);
	const [isSelectNumberResult, setIsSelectNumberResult] =
		useState<boolean>(false);
	const [isResultButtonDisabled, setIsResultButtonDisabled] =
		useState<boolean>(false);

	const [agendaTitle, setAgendaTitle] = useState('未設定');
	const didLogRef = useRef(false);

	const socket = io('http://localhost:4000');

	const handleAgendaTitleSubmit = () => {
		socket.emit('send_agenda_title', {
			agenda_title: agendaTitle,
			room_id: queryId,
		});
	};

	const handleCancelSubmitDisabled = () => {
		setIsAgendaTitleSubmitDisabled(false);
	};

	const handleSelectNumberResult = () => {
		setIsSelectNumberResult(true);
	};

	useEffect(() => {
		if (didLogRef.current === false) {
			didLogRef.current = true;
			socket.on('connect', () => {
				console.log('接続したよ！');
				socket.emit('join', {
					room_id: roomDataToLocalStorage?.roomId,
					id: roomDataToLocalStorage?.id,
					user_name: roomDataToLocalStorage?.userName,
					host_user: roomDataToLocalStorage?.hostUser,
				});

				socket.on('add_user_response', (data) => {
					console.log('user', data);
					setNewMyRoomUser({
						roomId: data.room_id,
						id: data.id,
						userName: data.user_name,
						hostUser: data.host_user,
						isSelected: false,
						selectCard: '',
					});
				});

				socket.on('select_number_response', (data) => {
					console.log('他のユーザーが選んだ番号を受信しました', data);
					setNewSelectCard({
						userName: data.user_name,
						roomId: data.room_id,
						selectCard: data.select_card,
					});
				});

				socket.on('agenda_title_response', (data) => {
					console.log('議題タイトルを受信しました', data);
					setNewAgendaTitle(data.agenda_title);
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
			!myRoomUsers.some((user) => user.userName === newMyRoomUser.userName)
		) {
			setMyRoomUsers([...myRoomUsers, newMyRoomUser]);
		}
	}, [newMyRoomUser]);

	useEffect(() => {
		if (newSelectCard) {
			const upDataMyRoomUserStatus = myRoomUsers.map((user) => {
				if (user.userName === newSelectCard.userName) {
					return {
						...user,
						isSelected: true,
						selectCard: newSelectCard.selectCard,
					};
				}
				return user;
			});
			setMyRoomUsers(upDataMyRoomUserStatus);

			const checkNumberNotSelected = myRoomUsers.some(
				(user) => !user.isSelected
			);
			if (!checkNumberNotSelected) {
				setIsResultButtonDisabled(true);
			}
		}
	}, [newSelectCard]);

	useEffect(() => {
		if (newAgendaTitle !== '') {
			setAgendaTitle(newAgendaTitle);
			setIsAgendaTitleSubmitDisabled(true);
		}
	}, [newAgendaTitle]);

	const checkRoomId = async (queryId: string) => {
		if (roomDataToLocalStorage?.roomId != queryId) {
			router.replace('/');
		}
		try {
			const response = await api.get(`/pokers/${queryId}`);
			const convertToCamelCase = response.data.users.map((res: any) => ({
				id: res.id,
				userName: res.user_name,
				hostUser: res.host_user,
				roomId: res.owner_id,
				isSelected: false,
				selectCard: '',
			}));
			setMyRoomUsers(convertToCamelCase);
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
			console.log('res', response);
			setRoomDataToLocalStorage(JSON.parse(response));
		}
	};

	const handleLeaveTheRoom = async () => {
		localStorage.removeItem('ROOM_DATA');
		const response = await api.delete(
			`/pokers/${roomDataToLocalStorage?.roomId}/users/${roomDataToLocalStorage?.id}`
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

	const handleResetSelectCard = () => {
		setIsSelectNumberResult(false);
		const resetIsSelectedUsers = myRoomUsers.map((user) => ({
			...user,
			isSelected: false,
		}));
		setMyRoomUsers(resetIsSelectedUsers);
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
			{isConfirmModal && (
				<ConfirmSelectNumberModal
					selectCard={selectCard}
					socket={socket}
					roomId={queryId}
					userName={roomDataToLocalStorage?.userName || ''}
					setIsConfirmModal={setIsConfirmModal}
				/>
			)}
			<div className="bg-orange-400 p-4 mb-4">
				{roomDataToLocalStorage?.hostUser ? (
					<div className="flex justify-between items-center">
						<div className="flex justify-start items-center w-5/6">
							<div className="mr-4 w-1/2">
								<input
									type="text"
									className="bg-orange-400 border p-2 w-full"
									onChange={(e) => setAgendaTitle(e.target.value)}
								/>
							</div>
							<div className="mr-4">
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
									onClick={handleAgendaTitleSubmit}
									disabled={isAgendaTitleSubmitDisabled}
								>
									決定
								</button>
							</div>
							<button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
								onClick={handleCancelSubmitDisabled}
								disabled={!isAgendaTitleSubmitDisabled}
							>
								取り消し
							</button>
						</div>
						<div className="flex justify-start">
						<div>
							<button
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
								onClick={handleSelectNumberResult}
								disabled={!isResultButtonDisabled}
							>
								結果を見る
							</button>
						</div>
							<div>
								<button
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
									onClick={handleResetSelectCard}
								>
									もう一度
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="p-2">
						<h3 className="text-xl">{agendaTitle}</h3>
					</div>
				)}
			</div>
			<ul className="flex justify-start">
				{myRoomUsers.map((user) => {
					if (user.userName === roomDataToLocalStorage?.userName) {
						return (
							<li key={user.userName} className="text-red-600">
								<div className="w-28 h-40 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
										<p className="text-3xl">
									{isSelectNumberResult ? user.selectCard : '?'}
										</p>
								</div>
								<div className="flex justify-center items-center">
									{user.hostUser && <FontAwesomeIcon icon={faUserTie} />}
									<p className="text-center">{user.userName}</p>
								</div>
							</li>
						);
					}
					return (
						<li key={user.userName}>
							<div className="w-20 h-28 border border-blue-600 shadow-lg flex justify-center items-center mb-4 mr-4">
								<p className="text-3xl">
									{isSelectNumberResult ? user.selectCard : '?'}
								</p>
							</div>
							<div className="flex justify-center items-center">
								{user.hostUser && <FontAwesomeIcon icon={faUserTie} />}
								<p className="text-center">{user.userName}</p>
							</div>
						</li>
					);
				})}
			</ul>
			<div className="fixed bottom-0 left-1/2 -translate-x-1/2">
				<div className="mb-4">
					<p className="text-xl">カードを選択</p>
				</div>
				<FibonacciNumbers
					handleOpenConfirmModal={handleOpenConfirmModal}
					isSelectNumberCard={!isAgendaTitleSubmitDisabled}
				/>
				<hr />
			</div>
		</div>
	);
};

export default PokerRoom;
