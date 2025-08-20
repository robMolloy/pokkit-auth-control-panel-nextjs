import { create } from "zustand";
import { TSuperUser } from "./dbSuperUserHelpers";

type TSuperUserState = TSuperUser | null;

export const useSuperUserAuthStore = create<{
  data: TSuperUserState;
  setData: (x: TSuperUserState) => void;
  clear: () => void;
}>()((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

// export const useSuperUserAuthStore = () => {
//   const store = useInitSuperUserAuthStore();

//   return store;
// };
