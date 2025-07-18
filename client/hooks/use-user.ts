import { IUser } from "@/types";
import { create } from "zustand";

type Store = {
  user: IUser;
  setUser: (user: IUser) => void;
};

export const useAuth = create<Store>()((set) => ({
  user: {
    name: null,
    allowInvites: true,
    status: "online",
    socketId: null,
  },
  setUser: (user: IUser) => set({ user }),
}));
