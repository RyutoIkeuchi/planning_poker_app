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

export type ResSelectedNumberCardType = Required<
  Pick<ToLocalStorageUserType, "roomId" | "selectedNumberCard" | "userName">
>;

export type PokerStatusType = "result" | "reset" | "default";
