import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect } from "react";
import { create } from "zustand";

type TState = PocketBase | null;

const useInitPocketBaseStore = create<{
  data: TState;
  setData: (x: TState) => void;
  clear: () => void;
}>()((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

export const usePocketBaseStore = () => {
  const initPocketBaseStore = useInitPocketBaseStore();

  useEffect(() => {
    if (initPocketBaseStore.data) initPocketBaseStore.data.autoCancellation(false);
  }, [initPocketBaseStore.data]);

  return initPocketBaseStore;
};
