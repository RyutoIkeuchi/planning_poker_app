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

export type ResSelectedNumberCardType = {
  roomId: string;
  selectedNumberCard: string;
  userName: string;
};

export type PokerStatusType = "result" | "reset" | "default";
