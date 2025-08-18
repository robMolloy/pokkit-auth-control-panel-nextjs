import { checkPocketBaseUrlHealth, PocketBase } from "@/modules/pocketBase/pocketBaseHelpers";
import { useEffect } from "react";
import { create } from "zustand";

type TPocketBaseState = PocketBase | undefined | null;
const useInitPocketBaseStore = create<{
  data: TPocketBaseState;
  setData: (x: TPocketBaseState) => void;
  clear: () => void;
}>()((set) => ({
  data: undefined,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

const persistenceKey = "pocketBaseUrl";
export const usePocketBaseStore = () => {
  const initPocketBaseStore = useInitPocketBaseStore();

  useEffect(() => {
    const url = localStorage.getItem(persistenceKey);
    if (!url) {
      localStorage.removeItem(persistenceKey); // unnecessary
      initPocketBaseStore.setData(null);
      return;
    }

    (async () => {
      const resp = await checkPocketBaseUrlHealth(url);
      initPocketBaseStore.setData(resp.success ? resp.data.pb : null);
    })();
  }, []);

  useEffect(() => {
    if (!initPocketBaseStore.data) return localStorage.removeItem(persistenceKey);

    const url = initPocketBaseStore.data.baseURL;
    localStorage.setItem(persistenceKey, url);
  }, [initPocketBaseStore.data]);

  return initPocketBaseStore;
};
