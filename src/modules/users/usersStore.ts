import { create } from "zustand";
import { TUser } from "./dbUserUtils";

type TState = TUser[] | null | undefined;

export const useUsersStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: undefined,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: [] })),
}));
