import { IUser } from "@/types";
import { create } from "zustand";

type Store = {
  roomUsers: IUser[];
  setRoomUsers: (users: IUser[]) => void;
};

export const useOnlineUsers = create<Store>()((set) => ({
  roomUsers: [],
  setRoomUsers: (users) => set({ roomUsers: users }),
}));
