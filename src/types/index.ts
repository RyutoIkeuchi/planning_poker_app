export type ToLocalStorageUserType = {
  id: number;
  hostUser: boolean;
  roomId: string;
  selectedNumberCard?: string;
  userName: string;
};

export type UserType = ToLocalStorageUserType & {
  isSelected: boolean;
};

export type PokerType = {
  id: number;
  agendaTitle: string;
  pokerStatus: string;
  roomId: string;
  users: UserType[];
};

export type StepperStatesPros<T> = {
  title: string
  status:T
}