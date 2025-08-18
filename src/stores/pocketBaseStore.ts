import { checkPocketBaseUrlHealth, PocketBase } from "@/modules/pocketBase/pocketBaseHelpers";
import { useEffect } from "react";
import { create } from "zustand";

type TUrlState = string | null;
const useInitPocketBaseUrlStore = create<{
  data: TUrlState;
  setData: (x: TUrlState) => void;
  clear: () => void;
}>()((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

const persistenceKey = "pocketbaseUrl";
export const usePocketBaseUrlStore = () => {
  const initPocketBaseUrlStore = useInitPocketBaseUrlStore();
  useEffect(() => {
    const url = localStorage.getItem(persistenceKey);
    initPocketBaseUrlStore.setData(url);
  }, []);
  useEffect(() => {
    const url = initPocketBaseUrlStore.data ? initPocketBaseUrlStore.data : "";
    localStorage.setItem(persistenceKey, url);
  }, [initPocketBaseUrlStore.data]);
  return initPocketBaseUrlStore;
};

type TPocketBaseState = PocketBase | undefined | null;
const useInitPocketBaseStore = create<{
  data: TPocketBaseState;
  setData: (x: TPocketBaseState) => void;
  clear: () => void;
}>()((set) => ({
  data: null,
  setData: (data) => set(() => ({ data })),
  clear: () => set(() => ({ data: null })),
}));

export const usePocketBaseStore = () => {
  const initPocketBaseStore = useInitPocketBaseStore();
  const pocketBaseUrlStore = usePocketBaseUrlStore();

  useEffect(() => {
    console.log(`pocketBaseStore.ts:${/*LL*/ 46}`, !pocketBaseUrlStore.data);
    if (!pocketBaseUrlStore.data) return;
    console.log(`pocketBaseStore.ts:${/*LL*/ 48}`, !pocketBaseUrlStore.data);

    const url = pocketBaseUrlStore.data;
    (async () => {
      const resp = await checkPocketBaseUrlHealth(url);
      initPocketBaseStore.setData(resp.success ? new PocketBase(url) : null);
    })();
  }, [pocketBaseUrlStore.data]);

  return initPocketBaseStore;
};
