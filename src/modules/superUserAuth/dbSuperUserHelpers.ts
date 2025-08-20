import { z } from "zod";
import { PocketBase } from "../pocketBase/pocketBaseHelpers";

const collectionName = "_superusers";

export const superUserSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(collectionName),
  id: z.string(),
  email: z.string(),
  updated: z.string(),
});

export type TSuperUser = z.infer<typeof superUserSchema>;
export type TSuperUserState = TSuperUser | null;

export const superUserLogin = async (p: { pb: PocketBase; username: string; password: string }) => {
  try {
    const resp = await p.pb.collection(collectionName).authWithPassword(p.username, p.password);

    return superUserSchema.safeParse(resp.record);
  } catch (error) {
    return { success: false, error } as const;
  }
};
