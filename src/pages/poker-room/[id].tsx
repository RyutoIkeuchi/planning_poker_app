import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SelectCardUserType, UserType } from 'src/types/interface';
import io from 'socket.io-client';
import { api } from 'src/service/api';
import { ConfirmSelectNumberModal } from 'src/components/ConfirmSelectNumberModal';
import { FibonacciNumbers } from 'src/components/FibonacciNumbers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { AgendaTitle } from 'src/components/PokerRoom/AgendaTitle';
import { ResultAndAgainButton } from 'src/components/PokerRoom/ResultAndAgainButton';

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
		useState<boolean>(true);
	const [isCancelAgendaTitleDisabled, setIsCancelAgendaTitleDisabled] =
		useState<boolean>(true);
	const [isSelectNumberResult, setIsSelectNumberResult] =
		useState<boolean>(false);
	const [isResultButtonDisabled, setIsResultButtonDisabled] =
		useState<boolean>(true);
	const [isAgainButtonDisabled, setIsAgainButtonDisabled] =
		useState<boolean>(true);
	const [isSelectNumberCard, setIsSelectNumberCard] = useState<boolean>(true);

	const [agendaTitle, setAgendaTitle] = useState('');
	const didLogRef = useRef(false);

	const socket = io('http://localhost:4000');

	const handleSubmitAgendaTitle = () => {
		socket.emit('send_agenda_title', {
			agenda_title: agendaTitle,
			room_id: queryId,
		});
		setIsCancelAgendaTitleDisabled(false);
	};

	const handleCancelAgendaTitle = () => {
		setAgendaTitle('');
		setIsCancelAgendaTitleDisabled(true);
		socket.emit('send_agenda_title', {
			agenda_title: '',
			room_id: queryId,
		});
	};

	const handleResultSelectNumber = () => {
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

				socket.on('response_add_user', (data) => {
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

				socket.on('response_select_number', (data) => {
					console.log('他のユーザーが選んだ番号を受信しました', data);
					setNewSelectCard({
						userName: data.user_name,
						roomId: data.room_id,
						selectCard: data.select_card,
					});
				});

				socket.on('response_agenda_title', (data) => {
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
			setIsAgainButtonDisabled(false);
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
				setIsResultButtonDisabled(false);
			}
		}
	}, [newSelectCard]);

	useEffect(() => {
		if (newAgendaTitle !== '') {
			setAgendaTitle(newAgendaTitle);
			setIsAgendaTitleSubmitDisabled(true);
			setIsSelectNumberCard(false);
		} else {
			setIsSelectNumberCard(true);
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
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
			<div className="py-4 mb-4">
				{roomDataToLocalStorage?.hostUser ? (
					<div className="flex justify-between items-center">
						<AgendaTitle
							agendaTitle={agendaTitle}
							setAgendaTitle={setAgendaTitle}
							handleSubmitAgendaTitle={handleSubmitAgendaTitle}
							isAgendaTitleSubmitDisabled={isAgendaTitleSubmitDisabled}
							setIsAgendaTitleSubmitDisabled={setIsAgendaTitleSubmitDisabled}
							handleCancelAgendaTitle={handleCancelAgendaTitle}
							isCancelAgendaTitleDisabled={isCancelAgendaTitleDisabled}
						/>
						<ResultAndAgainButton
							handleResultSelectNumber={handleResultSelectNumber}
							isResultButtonDisabled={isResultButtonDisabled}
							handleResetSelectCard={handleResetSelectCard}
							isAgainButtonDisabled={isAgainButtonDisabled}
						/>
					</div>
				) : (
					<div className="p-2">
						<h3 className="text-xl">{agendaTitle}</h3>
					</div>
				)}
			</div>
			<div className="mb-4">
				<div className="text-center p-10">
					<div className="mb-4">
						<p className="text-xl">スプリントポイント</p>
					</div>
					<p className="text-6xl font-bold">
						{isSelectNumberResult ? '5.5' : '?'}
					</p>
				</div>
			</div>
			<div>
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
			</div>
			<div className="fixed bottom-0 left-1/2 -translate-x-1/2">
				<div className="mb-4">
					<p className="text-xl">カードを選択</p>
				</div>
				<FibonacciNumbers
					handleOpenConfirmModal={handleOpenConfirmModal}
					isSelectNumberCard={isSelectNumberCard}
				/>
				<hr />
			</div>
		</div>
	);
};

export default PokerRoom;
