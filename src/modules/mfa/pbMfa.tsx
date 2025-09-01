import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { z } from "zod";

const outerSchema = z.record(z.string(), z.unknown());
const innerSchema = outerSchema;
const messageObjSchema = z.object({ message: z.string() });
const errorSchema = z.object({
  message: z.string().optional(),
  response: z.object({
    data: outerSchema.transform((outerObj) => {
      const messages: string[] = [];

      Object.values(outerObj)
        .map((innerObj) => {
          const innerParsed = innerSchema.safeParse(innerObj);
          return innerParsed.success ? innerParsed.data : null;
        })
        .filter((val) => !!val)
        .map((innerObj) => {
          return Object.values(innerObj)
            .map((messageObj) => {
              const messageObjParsed = messageObjSchema.safeParse(messageObj);
              return messageObjParsed.success ? messageObjParsed.data : null;
            })
            .filter((val) => !!val);
        })
        .forEach((outerValue) => {
          outerValue.forEach((messageObj) => {
            messages.push(messageObj.message);
          });
        });

      return { messages };
    }),
  }),
});

const extractMessageFromPbError = (p: { error: unknown }) => {
  const parsed = errorSchema.safeParse(p.error);

  if (!parsed.success) return;

  const initMessages = parsed.data.response.data.messages;
  const messageAsArray = parsed.data.message ? [parsed.data.message] : [];
  const messages = [...messageAsArray, ...initMessages];

  if (messages.length === 0) return;
  return messages;
};

const collectionName = usersCollectionName;
export const enableMfa = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { mfa: { enabled: true } });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Enable MFA unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages };
      })(),
    } as const;
  }
};

export const disableMfa = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      mfa: { enabled: false },
    });

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Disable MFA unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages };
      })(),
    } as const;
  }
};
