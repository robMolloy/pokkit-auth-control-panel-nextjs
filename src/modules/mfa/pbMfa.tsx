import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { z } from "zod";

const outerSchema = z.record(z.string(), z.unknown());
// const innerSchema = outerSchema;
const messageObjSchema = z.object({ message: z.string() });

const extractMessageFromPbError = (p: { error: unknown }) => {
  const errorSchema1 = z.object({
    message: z.string().optional(),
    response: z.object({
      data: z.record(z.string(), z.unknown()).transform((outerObj) => {
        const messages: string[] = [];

        Object.values(outerObj)
          .map((outerValue) => {
            const outerParsed = outerSchema.safeParse(outerValue);
            return outerParsed.success ? outerParsed.data : null;
          })
          .filter((val) => !!val)
          .map((outerValue) => {
            return Object.values(outerValue)
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
  const parsed1 = errorSchema1.safeParse(p.error);

  if (!parsed1.success) return;

  const initMessages = parsed1.data.response.data.messages;
  const messages = [parsed1.data.message, ...initMessages].filter((x) => !!x);
  if (messages.length === 0) return;
  return messages;
};

const collectionName = usersCollectionName;
export const enableMfa = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { mfa: { enabled: true } });
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    const messagesResponse = extractMessageFromPbError({ error });
    console.log({ messagesResponse });

    const errorSchema = z.object({
      message: z.string().optional(),
      response: z
        .object({
          data: z
            .object({
              mfa: z
                .object({ enabled: z.object({ message: z.string().optional() }).optional() })
                .optional(),
            })
            .optional(),
        })
        .optional(),
    });

    const parsed = errorSchema.safeParse(error);
    return {
      success: false,
      error: (() => {
        const message = parsed.success
          ? (parsed.data.response?.data?.mfa?.enabled?.message ?? parsed.data.message)
          : "Enable MFA unsuccessful";

        return { message };
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
      response: z
        .object({
          data: z
            .object({
              mfa: z
                .object({ enabled: z.object({ message: z.string().optional() }).optional() })
                .optional(),
            })
            .optional(),
        })
        .optional(),
    });

    const parsed = errorSchema.safeParse(error);
    return {
      success: false,
      error: (() => {
        const message = parsed.success
          ? (parsed.data.response?.data?.mfa?.enabled?.message ?? parsed.data.message)
          : "Disable MFA unsuccessful";

        return { message };
      })(),
    } as const;
  }
};
