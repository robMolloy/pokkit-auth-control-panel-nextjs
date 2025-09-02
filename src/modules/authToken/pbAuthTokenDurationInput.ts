import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { extractMessageFromPbError } from "../utils/pbUtils";

const collectionName = usersCollectionName;
export const updateAuthTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      authtoken: { duration: p.value },
    });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Update authTokenDuration unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages } as const;
      })(),
    } as const;
  }
};
