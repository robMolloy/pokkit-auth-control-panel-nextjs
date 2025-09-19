import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { generateToken } from "@/lib/utils";
import { DeepPartial } from "../utils/typeUtils";

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
  successMessage: string;
}) => {
  try {
    const collection = await p.pb.collections.update(collectionName, p.usersCollection);

    const data = usersCollectionSchema.parse(collection);
    const messages = [p.successMessage];
    return { success: true, data, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const fallback = "Failed to update usersCollection";
    const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

    return {
      success: false,
      error,
      messages,
    } as const;
  }
};

export const updateAuthTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { duration: p.value } },
    successMessage: "Successfully updated authToken duration",
  });
};

export const updateProtectedFileAccessTokenDuration = async (p: {
  pb: PocketBase;
  value: number;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { fileToken: { duration: p.value } },
    successMessage: "Successfully updated protectedFileAccessToken duration",
  });
};

export const updateEmailChangeTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { emailChangeToken: { duration: p.value } },
    successMessage: "Successfully updated emailChangeToken duration",
  });
};

export const updateEmailVerificationTokenDuration = async (p: {
  pb: PocketBase;
  value: number;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { verificationToken: { duration: p.value } },
    successMessage: "Successfully updated verificationToken duration",
  });
};

export const updatePasswordResetTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { passwordResetToken: { duration: p.value } },
    successMessage: "Successfully updated passwordResetToken duration",
  });
};

export const invalidateAuthTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated authTokens",
  });
};

export const invalidateEmailChangeTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { emailChangeToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated emailChangeTokens",
  });
};

export const invalidateEmailVerificationTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { verificationToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated emailVerificationTokens",
  });
};

export const invalidateFileAccessTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { fileToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated fileAccessTokens",
  });
};

export const invalidatePasswordResetTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { passwordResetToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated passwordResetTokens",
  });
};

export const enableAuthAlert = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authAlert: { enabled: true } },
    successMessage: "Successfully enabled authAlert",
  });
};

export const disableAuthAlert = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authAlert: { enabled: false } },
    successMessage: "Successfully disabled authAlert",
  });
};

export const updateAuthAlertEmailTemplate = async (p: {
  pb: PocketBase;
  authAlertEmailTemplate: TInitUsersCollectionUpdateSeed["authAlert"]["emailTemplate"];
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authAlert: { emailTemplate: p.authAlertEmailTemplate } },
    successMessage: "Successfully updated authAlert email template",
  });
};
