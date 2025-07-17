import { IUser } from "@/types";
import { create } from "zustand";

type Store = {
  onlineUsers: IUser[];
  setOnlineUsers: (users: IUser[]) => void;
};

export const useOnlineUsers = create<Store>()((set) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
