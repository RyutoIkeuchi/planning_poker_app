export type UserType = {
	id: number;
	userName: string;
	hostUser: boolean;
	roomId: string;
	isSelected: boolean;
	selectCard: string;
};

export type SelectCardUserType = {
	userName: string;
	roomId: string;
	selectCard: string;
};
