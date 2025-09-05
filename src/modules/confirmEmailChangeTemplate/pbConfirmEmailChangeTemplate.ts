import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { extractMessageFromPbError } from "../utils/pbUtils";

const collectionName = usersCollectionName;
export const updateConfirmEmailChangeTemplate = async (p: {
  pb: PocketBase;
  value: {
    subject: string;
    body: string;
  };
}) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      verificationTemplate: { body: p.value.body, subject: p.value.subject },
    });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Update confirmEmailChangeTemplate unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages } as const;
      })(),
    } as const;
  }
};
