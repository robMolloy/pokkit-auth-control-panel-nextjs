import { PocketBase } from "@/config/pocketbaseConfig";
import { generateToken } from "@/lib/utils";
import { updateUsersCollectionModel } from "./dbUsersCollectionModelHelpers";

export const invalidateAuthTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { authToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated authTokens",
    failMessage: "Failed to invalidate authTokens",
  });
};

export const invalidateEmailChangeTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { emailChangeToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated emailChangeTokens",
    failMessage: "Failed to invalidate emailChangeTokens",
  });
};

export const invalidateEmailVerificationTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { verificationToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated emailVerificationTokens",
    failMessage: "Failed to invalidate emailVerificationTokens",
  });
};

export const invalidateFileAccessTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { fileToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated fileAccessTokens",
    failMessage: "Failed to invalidate fileAccessTokens",
  });
};

export const invalidatePasswordResetTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { passwordResetToken: { secret: generateToken() } },
    successMessage: "Successfully invalidated passwordResetTokens",
    failMessage: "Failed to invalidate passwordResetTokens",
  });
};
