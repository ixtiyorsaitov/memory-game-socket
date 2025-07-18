export interface IUser {
  name: string | null;
  allowInvites: boolean;
  socketId: string | null;
  status: "online" | "playing";
}
