import { decodeJwt } from "@/lib/utils";
import { logout } from "@/modules/auth/dbAuthUtils";
import { superuserSchema, TSuperuser } from "@/modules/superusers/dbSuperusersUtils";
import PocketBase from "pocketbase";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { create } from "zustand";

const pocketbaseAuthStoreSchema = z.object({
  token: z.string(),
  record: superuserSchema,
});
type TAuth = z.infer<typeof pocketbaseAuthStoreSchema>;

type TState = { authStatus: "loading" | "loggedOut" } | { authStatus: "loggedIn"; user: TAuth };

export const useUnverifiedIsLoggedInStore = create<{
  data: TState;
  setData: (x: TState) => void;
}>()((set) => ({
  data: { authStatus: "loading" },
  setData: (data) => set(() => ({ data })),
}));

export const useUnverifiedIsLoggedInSync = (p: { pb: PocketBase }) => {
  const isLoggedInStore = useUnverifiedIsLoggedInStore();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleAuthChange = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!p.pb.authStore.isValid) return isLoggedInStore.setData({ authStatus: "loggedOut" });
    const resp = pocketbaseAuthStoreSchema.safeParse(p.pb.authStore);

    if (!resp.success) return isLoggedInStore.setData({ authStatus: "loggedOut" });
    isLoggedInStore.setData({ authStatus: "loggedIn", user: resp.data });

    const decodeResponse = decodeJwt(resp.data.token);
    if (!decodeResponse.success) return isLoggedInStore.setData({ authStatus: "loggedOut" });
    const timeToExpire = new Date().getTime() - decodeResponse.data.payload.exp * 1000;

    timeoutRef.current = setTimeout(() => {
      isLoggedInStore.setData({ authStatus: "loggedOut" });

      if (isLoggedInStore.data.authStatus === "loggedOut") logout(p);
    }, timeToExpire);
  };
  useEffect(() => handleAuthChange(), []);
  useEffect(() => {
    p.pb.authStore.onChange(() => handleAuthChange());
  }, []);
};

type TCurrentUserState =
  | { authStatus: "loading" | "loggedOut" }
  | { authStatus: "loggedIn"; user: TSuperuser };

export const useCurrentUserStore = create<{
  data: TCurrentUserState;
  setData: (x: TCurrentUserState) => void;
}>()((set) => ({
  data: { authStatus: "loading" },
  setData: (data) => set(() => ({ data })),
}));
