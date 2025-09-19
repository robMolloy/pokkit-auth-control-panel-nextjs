import PocketBase from "pocketbase";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";

export const userSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal("users"),
  id: z.string(),
  email: z.string(),
  name: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type TUser = z.infer<typeof userSchema>;

export const getUser = async (p: { pb: PocketBase; id: string }) => {
  try {
    const userResp = await p.pb.collection("users").getOne(p.id);
    return userSchema.safeParse(userResp);
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};
export const subscribeToUser = async (p: {
  pb: PocketBase;
  id: string;
  onChange: (e: TUser | null) => void;
}) => {
  try {
    const userResp = await getUser(p);
    p.onChange(userResp.success ? userResp.data : null);

    const unsub = p.pb.collection("users").subscribe(p.id, (e) => {
      const parseResp = userSchema.safeParse(e.record);
      p.onChange(parseResp.success ? parseResp.data : null);
    });

    return { success: true, data: unsub } as const;
  } catch (error) {
    p.onChange(null);
    return { success: false, error } as const;
  }
};

export const deleteUser = async (p: { pb: PocketBase; id: string }) => {
  try {
    const resp = await p.pb.collection("users").delete(p.id);

    z.literal(true).parse(resp);

    const messages = ["Successfully deleted user"];
    return { success: true, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const title = "Failed to delete user";
    const messages = [title, ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};
