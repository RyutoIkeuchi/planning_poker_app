export type UserType = {
  id: number;
  hostUser: boolean;
  isSelected: boolean;
  roomId: string;
  selectCard: string;
  userName: string;
};

export type SelectCardUserType = {
  roomId: string;
  selectCard: string;
  userName: string;
};
