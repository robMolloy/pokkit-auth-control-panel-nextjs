import PocketBase from "pocketbase";
import { TUser, userSchema } from "./dbUserUtils";

export const listUsers = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection("users").getFullList();

    const data = initData
      .map((x) => userSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const subscribeToUsers = async (p: {
  pb: PocketBase;
  initDocs: TUser[];
  onChange: (e: TUser[]) => void;
}) => {
  let allDocs: TUser[] = p.initDocs ? p.initDocs : [];

  const unsub = await p.pb.collection("users").subscribe("*", (e: any) => {
    if (e.action === "create") {
      const parseResp = userSchema.safeParse(e.record);
      if (parseResp.success) allDocs.push(parseResp.data);
    }
    if (e.action === "update") {
      const parseResp = userSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    }
    if (e.action === "delete") {
      const parseResp = userSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });

  return { success: true, data: unsub } as const;
};

export const smartSubscribeToUsers = async (p: {
  pb: PocketBase;
  onChange: (x: TUser[]) => void;
}) => {
  const listUsersResp = await listUsers(p);
  if (!listUsersResp.success) return listUsersResp;

  let allDocs = listUsersResp.data;
  p.onChange(allDocs);
  return subscribeToUsers({ pb: p.pb, initDocs: allDocs, onChange: p.onChange });
};
