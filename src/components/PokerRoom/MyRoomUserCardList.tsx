import { UserType } from 'src/types/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';

type Props = {
	myRoomUsers: UserType[];
	myUserName: string;
	isSelectNumberResult: boolean;
};

export const MyRoomUserCardList = (props: Props) => {
	const { myRoomUsers, myUserName, isSelectNumberResult } = props;

	return (
		<ul className="flex justify-start">
			{myRoomUsers.map((user, index) => {
				return (
					<li
						key={index}
						className={`w-28 h-40 mr-10 ${
							user.userName === myUserName && 'text-red-600'
						}`}
					>
						<div className="w-full h-full border border-blue-600 shadow-lg flex justify-center items-center mb-4">
							<p className="text-3xl">
								{isSelectNumberResult
									? user.selectCard
									: user.isSelected
									? '済'
									: '未'}
							</p>
						</div>
						<div className="flex justify-center items-center">
							{user.hostUser && <FontAwesomeIcon icon={faUserTie} />}
							<p className="text-center ml-1">{user.userName}</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
};
