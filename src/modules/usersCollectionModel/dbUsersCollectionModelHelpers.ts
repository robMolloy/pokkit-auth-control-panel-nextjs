import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { DeepPartial } from "../utils/typeUtils";

const collectionName = "users";
export const usersCollectionName = collectionName;
const templateSchema = z.object({ subject: z.string(), body: z.string() });
export type TTemplate = z.infer<typeof templateSchema>;

export const usersCollectionSchema = z.object({
  created: z.string(),
  authAlert: z.object({
    enabled: z.boolean(),
    emailTemplate: templateSchema,
  }),
  authToken: z.object({
    duration: z.number(),
  }),
  confirmEmailChangeTemplate: templateSchema,
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
    emailTemplate: templateSchema,
  }),
  passwordAuth: z.object({
    enabled: z.boolean(),
  }),
  passwordResetToken: z.object({
    duration: z.number(),
  }),
  resetPasswordTemplate: templateSchema,
  verificationTemplate: templateSchema,
  verificationToken: z.object({
    duration: z.number(),
  }),
});

export type TUsersCollection = z.infer<typeof usersCollectionSchema>;

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

export const updateUsersCollectionModel = async (p: {
  pb: PocketBase;
  usersCollection: TUsersCollectionUpdateSeed;
  successMessage: string;
  failMessage: string;
}) => {
  try {
    const collection = await p.pb.collections.update(collectionName, p.usersCollection);

    const data = usersCollectionSchema.parse(collection);
    const messages = [p.successMessage];
    return { success: true, data, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = [p.failMessage, ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};
