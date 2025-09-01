import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { extractMessageFromPbError } from "../utils/pbUtils";

const collectionName = usersCollectionName;
export const enableOtp = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { otp: { enabled: true } });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Enable OTP unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages };
      })(),
    } as const;
  }
};

export const disableOtp = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      otp: { enabled: false },
    });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Disable OTP unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages };
      })(),
    } as const;
  }
};
