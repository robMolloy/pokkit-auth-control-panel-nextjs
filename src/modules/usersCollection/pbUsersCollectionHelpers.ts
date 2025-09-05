import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

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

export const getUsersCollection = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.getOne(collectionName);
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
