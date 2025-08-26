import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { z } from "zod";

const collectionName = usersCollectionName;
export const enableMfa = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { mfa: { enabled: true } });
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    const errorSchema = z.object({
      message: z.string().optional(),
      mfa: z
        .object({ enabled: z.object({ message: z.string().optional() }).optional() })
        .optional(),
    });

    const parsed = errorSchema.safeParse(error);
    return {
      success: false,
      error: (() => {
        const message = parsed.success
          ? (parsed.data.mfa?.enabled?.message ?? parsed.data.message)
          : null;

        return message ? { message } : error;
      })(),
    } as const;
  }
};

export const disableMfa = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      mfa: { enabled: false },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    const errorSchema = z.object({
      message: z.string().optional(),
      mfa: z
        .object({ enabled: z.object({ message: z.string().optional() }).optional() })
        .optional(),
    });

    const parsed = errorSchema.safeParse(error);
    return {
      success: false,
      error: (() => {
        const message = parsed.success
          ? (parsed.data.mfa?.enabled?.message ?? parsed.data.message)
          : null;

        return message ? { message } : error;
      })(),
    } as const;
  }
};
