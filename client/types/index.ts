export interface IUser {
  name: string | null;
  allowInvites: boolean;
  socketId: string | null;
  status: "online" | "playing";
}

export interface IRoom {
  players: IUser[];
  id: string | null;
  admin: IUser | null;
}
