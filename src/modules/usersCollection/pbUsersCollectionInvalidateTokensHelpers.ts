import { PocketBase } from "@/config/pocketbaseConfig";
import { generateToken } from "@/lib/utils";
import { updateUsersCollection } from "./pbUsersCollectionHelpers";

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
