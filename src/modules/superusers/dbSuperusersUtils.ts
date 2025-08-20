import PocketBase from "pocketbase";
import { z } from "zod";

const collectionName = "_superusers";
export const superuserSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(collectionName),
  id: z.string(),
  email: z.string(),
  updated: z.string(),
});
export type TSuperuser = z.infer<typeof superuserSchema>;

export const listSuperusers = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection(collectionName).getFullList();

    const data = initData
      .map((x) => superuserSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const getSuperuser = async (p: { pb: PocketBase; id: string }) => {
  try {
    const userResp = await p.pb.collection(collectionName).getOne(p.id);
    return superuserSchema.safeParse(userResp);
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};
export const subscribeToSuperuser = async (p: {
  pb: PocketBase;
  id: string;
  onChange: (e: TSuperuser | null) => void;
}) => {
  try {
    const userResp = await getSuperuser(p);
    p.onChange(userResp.success ? userResp.data : null);

    const unsub = p.pb.collection(collectionName).subscribe(p.id, (e) => {
      const parseResp = superuserSchema.safeParse(e.record);
      p.onChange(parseResp.success ? parseResp.data : null);
    });

    return { success: true, data: unsub } as const;
  } catch (error) {
    p.onChange(null);
    return { success: false, error } as const;
  }
};

export const deleteSuperuser = async (p: { pb: PocketBase; id: string }) => {
  try {
    await p.pb.collection(collectionName).delete(p.id);
    return { success: true } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const superuserLogin = async (p: { pb: PocketBase; username: string; password: string }) => {
  try {
    const resp = await p.pb.collection(collectionName).authWithPassword(p.username, p.password);

    return superuserSchema.safeParse(resp.record);
  } catch (error) {
    return { success: false, error } as const;
  }
};
