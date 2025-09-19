import { PocketBase } from "@/config/pocketbaseConfig";
import { generateToken } from "@/lib/utils";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { DeepPartial } from "../utils/typeUtils";

const collectionName = "users";
export const usersCollectionName = collectionName;
const templateSchema = z.object({ subject: z.string(), body: z.string() });
type TTemplate = z.infer<typeof templateSchema>;

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

export const enableOtp = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { otp: { enabled: true } },
    successMessage: "Successfully enabled OTP",
  });
};

export const disableOtp = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { otp: { enabled: false } },
    successMessage: "Successfully disabled OTP",
  });
};

export const enableMfa = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { mfa: { enabled: true } },
    successMessage: "Successfully enabled MFA",
  });
};

export const disableMfa = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { mfa: { enabled: false } },
    successMessage: "Successfully disabled MFA",
  });
};

export const enablePasswordAuth = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { passwordAuth: { enabled: true } },
    successMessage: "Successfully enabled passwordAuth",
  });
};

export const disablePasswordAuth = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { passwordAuth: { enabled: false } },
    successMessage: "Successfully disabled passwordAuth",
  });
};

export const updateAuthAlertEmailTemplate = async (p: {
  pb: PocketBase;
  authAlertEmailTemplate: TTemplate;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authAlert: { emailTemplate: p.authAlertEmailTemplate } },
    successMessage: "Successfully updated authAlert email template",
  });
};

export const updateConfirmEmailChangeTemplate = async (p: {
  pb: PocketBase;
  confirmEmailChangeTemplate: TTemplate;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { confirmEmailChangeTemplate: p.confirmEmailChangeTemplate },
    successMessage: "Successfully updated confirmEmailChangeTemplate",
  });
};

export const updateEmailVerificationTemplate = async (p: {
  pb: PocketBase;
  template: TTemplate;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { verificationTemplate: p.template },
    successMessage: "Successfully updated emailVerificationTemplate",
  });
};

export const updateOtpEmailTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { otp: { emailTemplate: p.template } },
    successMessage: "Successfully updated OTP email template",
  });
};

export const updateResetPasswordTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { resetPasswordTemplate: p.template },
    successMessage: "Successfully updated resetPasswordTemplate",
  });
};
