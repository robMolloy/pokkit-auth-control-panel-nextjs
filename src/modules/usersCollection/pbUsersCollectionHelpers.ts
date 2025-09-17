import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { generateToken } from "@/lib/utils";

const collectionName = "users";
export const usersCollectionName = collectionName;
export const usersCollectionSchema = z.object({
  created: z.string(),
  authAlert: z.object({
    enabled: z.boolean(),
    emailTemplate: z.object({
      subject: z.string(),
      body: z.string(),
    }),
  }),
  authToken: z.object({
    duration: z.number(),
  }),
  confirmEmailChangeTemplate: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  emailChangeToken: z.object({
    duration: z.number(),
  }),
  fileToken: z.object({
    duration: z.number(),
  }),
  mfa: z.object({
    enabled: z.boolean(),
  }),
  oauth2: z.object({
    enabled: z.boolean(),
    providers: z.array(
      z.object({
        clientId: z.string(),
        name: z.string(),
      }),
    ),
  }),
  otp: z.object({
    enabled: z.boolean(),
    emailTemplate: z.object({
      subject: z.string(),
      body: z.string(),
    }),
  }),
  passwordAuth: z.object({
    enabled: z.boolean(),
  }),
  passwordResetToken: z.object({
    duration: z.number(),
  }),
  resetPasswordTemplate: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  verificationTemplate: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  verificationToken: z.object({
    duration: z.number(),
  }),
});

export type TUsersCollection = z.infer<typeof usersCollectionSchema>;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type TInitUsersCollectionUpdateSeed = Omit<
  TUsersCollection,
  "authToken" | "emailChangeToken" | "fileToken" | "passwordResetToken" | "verificationToken"
> & {
  authToken: TUsersCollection["authToken"] & { secret: string };
  emailChangeToken: TUsersCollection["emailChangeToken"] & { secret: string };
  fileToken: TUsersCollection["fileToken"] & { secret: string };
  passwordResetToken: TUsersCollection["passwordResetToken"] & { secret: string };
  verificationToken: TUsersCollection["verificationToken"] & { secret: string };
};
export type TUsersCollectionUpdateSeed = DeepPartial<TInitUsersCollectionUpdateSeed>;

export const getUsersCollection = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.getOne(collectionName);
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateUsersCollection = async (p: {
  pb: PocketBase;
  usersCollection: TUsersCollectionUpdateSeed;
}) => {
  try {
    const collection = await p.pb.collections.update(collectionName, p.usersCollection);

    const data = usersCollectionSchema.parse(collection);
    return { success: true, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Update usersCollection unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages } as const;
      })(),
    } as const;
  }
};

export const updateAuthTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { duration: p.value } },
  });
};

export const invalidateAuthTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { secret: generateToken() } },
  });
};
