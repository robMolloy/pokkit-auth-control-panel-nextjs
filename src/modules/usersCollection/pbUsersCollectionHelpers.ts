import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

const collectionName = "users";
const usersCollectionSchema = z.object({
  created: z.string(),
  oauth2: z.object({
    enabled: z.boolean(),
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

export const enableUsersCollectionOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { oauth2: { enabled: true } });
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const disableUsersCollectionOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      oauth2: { enabled: false },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
