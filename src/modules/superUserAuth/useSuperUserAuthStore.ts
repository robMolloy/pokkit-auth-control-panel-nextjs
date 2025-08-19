import { create } from "zustand";
import { TSuperUser } from "./dbSuperUserHelpers";
import { usePocketBaseStore } from "../pocketBase/pocketBaseStore";

type TSuperUserState = TSuperUser | null;

const useInitSuperUserAuthStore = create<{
  data: TSuperUserState;
  setData: (x: TSuperUserState) => void;
  clear: () => void;
}>()((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

export const useSuperUserAuthStore = () => {
  const pocketBaseStore = usePocketBaseStore();
  const { clear, ...store } = useInitSuperUserAuthStore();

  return {
    ...store,
    clear: async () => {
      await pocketBaseStore.data?.authStore.clear();
      clear();
    },
  } as const;
};
