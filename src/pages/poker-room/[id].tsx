import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectCardUserType, UserType } from 'src/types/interface';
import io from 'socket.io-client';
import { api } from 'src/service/api';
import { ConfirmSelectNumberModal } from 'src/components/ConfirmSelectNumberModal';
import { FibonacciNumbers } from 'src/components/FibonacciNumbers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { RoomHeader } from 'src/components/PokerRoom/RoomHeader';
import { SprintPointArea } from 'src/components/PokerRoom/SprintPointArea';
import { MyRoomUserCardList } from 'src/components/PokerRoom/MyRoomUserCardList';
import { AgendaTitleArea } from 'src/components/PokerRoom/AgendaTitleArea';

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
	const [selectCardAverage, setSelectCardAverage] = useState<number>(null);
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
	const [canChangeAgendaTitle, setCanChangeAgendaTitle] =
		useState<boolean>(true);

	const [agendaTitle, setAgendaTitle] = useState('');
	const [selectCardStatus, setSelectCardStatus] = useState<
		'result' | 'reset' | 'default'
	>('default');
	const didLogRef = useRef(false);

	const socket = io('http://localhost:4000');

	const handleSubmitAgendaTitle = async () => {
		socket.emit('send_agenda_title', {
			agenda_title: agendaTitle,
			room_id: queryId,
		});
		const data = {
			agenda_title: agendaTitle,
		};
		await api.put(`/pokers/${roomDataToLocalStorage?.roomId}`, data);
		setCanChangeAgendaTitle(false);
		setIsCancelAgendaTitleDisabled(false);
	};

	const handleCancelAgendaTitle = async () => {
		setAgendaTitle('');
		setCanChangeAgendaTitle(true);
		setIsCancelAgendaTitleDisabled(true);
		setIsSelectNumberResult(false);
		socket.emit('send_agenda_title', {
			agenda_title: '',
			room_id: queryId,
		});
		const data = {
			agenda_title: '',
		};
		await api.put(`/pokers/${roomDataToLocalStorage?.roomId}`, data);
	};

	const handleResultSelectNumber = () => {
		socket.emit('send_select_card_state', {
			status: 'result',
			room_id: roomDataToLocalStorage?.roomId,
		});
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

				socket.on('response_select_card_state', (data) => {
					console.log('カードの状態を受信しました', data);
					setSelectCardStatus(data.status);
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
		if (selectCardStatus === 'result') {
			calculateAverageOfSelectCard();
			setIsSelectNumberResult(true);
		}

		if (selectCardStatus === 'reset') {
			setIsSelectNumberResult(false);
			setIsSelectNumberCard(false);
			const resetIsSelectedUsers = myRoomUsers.map((user) => ({
				...user,
				selectCard: '',
				isSelected: false,
			}));
			setMyRoomUsers(resetIsSelectedUsers);
		}

		setSelectCardStatus('default');
	}, [selectCardStatus]);

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

			const checkNumberNotSelected = upDataMyRoomUserStatus.some(
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
			const resetIsSelectedUsers = myRoomUsers.map((user) => ({
				...user,
				isSelected: false,
			}));
			setMyRoomUsers(resetIsSelectedUsers);
			setAgendaTitle('');
			setIsSelectNumberCard(true);
		}
	}, [newAgendaTitle]);

	const checkRoomId = async (queryId: string) => {
		if (roomDataToLocalStorage?.roomId !== queryId) {
			router.replace('/');
		}
		try {
			const response = await api.get(`/pokers/${queryId}`);
			const convertToCamelCase = response.data.users.map((res: any) => ({
				id: res.id,
				userName: res.user_name,
				hostUser: res.host_user,
				roomId: res.owner_id,
				isSelected: res.select_number_card !== '',
				selectCard: res.select_number_card,
			}));
			setMyRoomUsers(convertToCamelCase);
			const existsNotSelectedNumberCardUser = convertToCamelCase.some(
				(user) => !user.isSelected
			);
			console.log(existsNotSelectedNumberCardUser);
			const agendaTitle = response.data.agenda_title;
			setAgendaTitle(agendaTitle);
			if (agendaTitle !== '') {
				setIsCancelAgendaTitleDisabled(false);
				setIsAgendaTitleSubmitDisabled(true);
				setCanChangeAgendaTitle(false);
				setIsSelectNumberCard(false);
				if (!existsNotSelectedNumberCardUser) {
					setIsSelectNumberCard(true);
					setIsResultButtonDisabled(false);
					setIsAgainButtonDisabled(false);
					setSelectCardStatus('result');
				}
			}
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
			`/pokers/${roomDataToLocalStorage?.roomId}/users/${roomDataToLocalStorage?.id}`
		);
		if (response.status == 204) {
			if (roomDataToLocalStorage?.hostUser) {
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

	const handleResetSelectCard = async () => {
		setIsResultButtonDisabled(true);
		socket.emit('send_select_card_state', {
			status: 'reset',
			room_id: roomDataToLocalStorage?.roomId,
		});
		const data = {
			select_number_card: '',
		};
		await api.put(
			`/pokers/${roomDataToLocalStorage?.roomId}/users/${roomDataToLocalStorage?.id}`,
			data
		);
	};

	const calculateAverageOfSelectCard = useCallback(() => {
		const filterNotSelectUserList = myRoomUsers.filter((user) => {
			if (user.selectCard !== '/') {
				return user;
			}
		});
		const total: number = filterNotSelectUserList.reduce(
			(acc, cur: UserType) => acc + Number(cur.selectCard),
			0
		);
		const average = total / filterNotSelectUserList.length;
		setSelectCardAverage(average);
	}, [myRoomUsers]);

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
		<div className="relative">
			<RoomHeader
				roomId={router.query.id as string}
				handleLeaveTheRoom={handleLeaveTheRoom}
			/>
			{isConfirmModal && (
				<ConfirmSelectNumberModal
					selectCard={selectCard}
					socket={socket}
					roomId={queryId}
					userId={roomDataToLocalStorage?.id}
					userName={roomDataToLocalStorage?.userName || ''}
					setIsConfirmModal={setIsConfirmModal}
					setIsSelectNumberCard={setIsSelectNumberCard}
				/>
			)}
			<AgendaTitleArea
				isHostUser={roomDataToLocalStorage?.hostUser}
				agendaTitle={agendaTitle}
				setAgendaTitle={setAgendaTitle}
				canChangeAgendaTitle={canChangeAgendaTitle}
				handleSubmitAgendaTitle={handleSubmitAgendaTitle}
				isAgendaTitleSubmitDisabled={isAgendaTitleSubmitDisabled}
				setIsAgendaTitleSubmitDisabled={setIsAgendaTitleSubmitDisabled}
				handleCancelAgendaTitle={handleCancelAgendaTitle}
				isCancelAgendaTitleDisabled={isCancelAgendaTitleDisabled}
				handleResultSelectNumber={handleResultSelectNumber}
				isResultButtonDisabled={isResultButtonDisabled}
				handleResetSelectCard={handleResetSelectCard}
				isAgainButtonDisabled={isAgainButtonDisabled}
			/>
			<SprintPointArea
				isSelectNumberResult={isSelectNumberResult}
				selectCardAverage={selectCardAverage}
			/>
			<MyRoomUserCardList
				myRoomUsers={myRoomUsers}
				myUserName={roomDataToLocalStorage?.userName}
				isSelectNumberResult={isSelectNumberResult}
			/>
			<div className="fixed bottom-0">
				<div className="mb-4 flex justify-start items-center">
					<p className="text-xl mr-2">カードを選択</p>
					{isSelectNumberCard ? (
						<FontAwesomeIcon icon={faBan} className="text-red-600" />
					) : (
						<FontAwesomeIcon icon={faCheck} className="text-green-600" />
					)}
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
