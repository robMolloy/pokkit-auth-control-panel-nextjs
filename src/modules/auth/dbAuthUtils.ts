import PocketBase from "pocketbase";

export const logout = (p: { pb: PocketBase }) => {
  p.pb.realtime.unsubscribe();
  p.pb.authStore.clear();
  return { success: true } as const;
};
