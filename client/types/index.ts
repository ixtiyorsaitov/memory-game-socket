export interface IUser {
  name: string | null;
  allowInvites: boolean;
  socketId: string;
  status: "online" | "playing";
}
