import { checkPocketBaseUrlHealth, PocketBase } from "@/modules/pocketBase/pocketBaseHelpers";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { superUserSchema } from "../superUserAuth/dbSuperUserHelpers";
import { useSuperUserAuthStore } from "../superUserAuth/useSuperUserAuthStore";
// import { useSuperUserAuthStore } from "../superUserAuth/useSuperUserAuthStore";

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
  const { clear, ...initPocketBaseStore } = useInitPocketBaseStore();
  const superUserAuthStore = useSuperUserAuthStore();

  useEffect(() => {
    if (initPocketBaseStore.data === undefined) return;
    if (!initPocketBaseStore.data) return localStorage.removeItem(persistenceKey);

    const url = initPocketBaseStore.data.baseURL;
    localStorage.setItem(persistenceKey, url);
  }, [initPocketBaseStore.data]);

  return {
    ...initPocketBaseStore,
    clear: async () => {
      await initPocketBaseStore.data?.authStore.clear();
      clear();
    },
    init: async () => {
      const url = localStorage.getItem(persistenceKey);
      if (!url) return initPocketBaseStore.setData(null);

      (async () => {
        const resp = await checkPocketBaseUrlHealth(url);
        initPocketBaseStore.setData(resp.success ? resp.data.pb : null);
      })();
    },
    logout: async () => {
      await initPocketBaseStore.data?.authStore.clear();
      superUserAuthStore.clear();
    },
  };
};

export const useAuthSync = () => {
  const initPocketBaseStore = useInitPocketBaseStore();
  const superUserAuthStore = useSuperUserAuthStore();

  const [listener, setListener] = useState<() => void>();
  const unsubscribeAndRemoveListener = () => {
    listener?.();
    setListener(undefined);
  };

  useEffect(() => {
    const pb = initPocketBaseStore.data;

    if (!pb) return unsubscribeAndRemoveListener();

    console.log(`pocketBaseStore.ts:${/*LL*/ 69}`, {});
    pb?.authStore.onChange(() => {
      console.log(`pocketBaseStore.ts:${/*LL*/ 71}`, pb.authStore.record);
    });
  }, [initPocketBaseStore.data]);
  useEffect(() => {
    const pb = initPocketBaseStore.data;

    if (!pb) {
      listener?.();
      setListener(undefined);
      return superUserAuthStore.clear();
    }

    console.log(`pocketBaseStore.ts:${/*LL*/ 69}`, {});
    pb?.authStore.onChange(() => {
      console.log(`pocketBaseStore.ts:${/*LL*/ 71}`, pb.authStore.record);
    });

    // avoid infinite loop with id comparison - probably due to NextJS strict mode (double render)
    if (pb.authStore.record && pb.authStore.record.id !== superUserAuthStore.data?.id) {
      const parsed = superUserSchema.safeParse(pb.authStore.record);
      if (parsed.success) superUserAuthStore.setData(parsed.data);
    }

    if (!pb.authStore.record) superUserAuthStore.setData(null);
  }, [initPocketBaseStore.data?.authStore.record]);
};
