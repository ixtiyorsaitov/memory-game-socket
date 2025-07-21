import { IRoom } from "@/types";
import { create } from "zustand";

type Store = {
  currentRoom: IRoom;
  setCurrentRoom: (room: IRoom) => void;
};

export const useCurrentRoom = create<Store>()((set) => ({
  currentRoom: {
    id: null,
    players: [],
    admin: null,
  },
  setCurrentRoom: (room) => set({ currentRoom: room }),
}));
