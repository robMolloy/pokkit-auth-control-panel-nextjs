import { PocketBase } from "@/config/pocketbaseConfig";
import { updateUsersCollectionModel } from "./dbUsersCollectionModelHelpers";

export const updateAuthTokenDuration = async (p: { pb: PocketBase; duration: number }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { authToken: { duration: p.duration } },
    successMessage: "Successfully updated authToken duration",
    failMessage: "Failed to update authToken duration",
  });
};

export const updateProtectedFileAccessTokenDuration = async (p: {
  pb: PocketBase;
  duration: number;
}) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { fileToken: { duration: p.duration } },
    successMessage: "Successfully updated protectedFileAccessToken duration",
    failMessage: "Failed to update protectedFileAccessToken duration",
  });
};

export const updateEmailChangeTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { emailChangeToken: { duration: p.value } },
    successMessage: "Successfully updated emailChangeToken duration",
    failMessage: "Failed to update emailChangeToken duration",
  });
};

export const updateEmailVerificationTokenDuration = async (p: {
  pb: PocketBase;
  duration: number;
}) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { verificationToken: { duration: p.duration } },
    successMessage: "Successfully updated verificationToken duration",
    failMessage: "Failed to update verificationToken duration",
  });
};

export const updatePasswordResetTokenDuration = async (p: { pb: PocketBase; duration: number }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { passwordResetToken: { duration: p.duration } },
    successMessage: "Successfully updated passwordResetToken duration",
    failMessage: "Failed to update passwordResetToken duration",
  });
};
