import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

const collectionName = "users";
const usersCollectionSchema = z.object({
  created: z.string(),
  oauth2: z.object({
    enabled: z.boolean(),
    providers: z.array(
      z.object({
        clientId: z.string(),
        name: z.string(),
      }),
    ),
  }),
});

export type TUsersCollection = z.infer<typeof usersCollectionSchema>;

export const getUsersCollection = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.getOne(collectionName);
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
