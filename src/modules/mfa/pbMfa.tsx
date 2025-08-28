import { PocketBase } from "@/config/pocketbaseConfig";
import {
  usersCollectionName,
  usersCollectionSchema,
} from "../usersCollection/pbUsersCollectionHelpers";
import { z } from "zod";

const extractMessageFromPbError = (p: { error: unknown }) => {
  const messages: string[] = [];
  const errorSchema1 = z.object({
    message: z.string().optional(),
    response: z.object({
      data: z.record(z.string(), z.unknown()).transform((x1) => {
        const values = Object.values(x1);
        values.forEach((value) => {
          const schema2 = z.record(z.string(), z.unknown());
          const parsed2 = schema2.safeParse(value);
          if (!parsed2.success) return;

          const values2 = Object.values(parsed2.data);
          values2.forEach((x2) => {
            const schema3 = z.object({ message: z.string() });
            const parsed3 = schema3.safeParse(x2);
            if (!parsed3.success) return;
            messages.push(parsed3.data.message);
          });
        });
      }),
    }),
  });
  const parsed1 = errorSchema1.safeParse(p.error);
  console.log(parsed1);

  if (!parsed1.success) return;

  if (messages.length === 0) undefined;
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
