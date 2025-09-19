import { PocketBase } from "@/config/pocketbaseConfig";
import { updateUsersCollection } from "./dbUsersCollectionModelHelpers";

export const updateAuthTokenDuration = async (p: { pb: PocketBase; duration: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { duration: p.duration } },
    successMessage: "Successfully updated authToken duration",
  });
};

export const updateProtectedFileAccessTokenDuration = async (p: {
  pb: PocketBase;
  duration: number;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { fileToken: { duration: p.duration } },
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
  duration: number;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { verificationToken: { duration: p.duration } },
    successMessage: "Successfully updated verificationToken duration",
  });
};

export const updatePasswordResetTokenDuration = async (p: { pb: PocketBase; duration: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { passwordResetToken: { duration: p.duration } },
    successMessage: "Successfully updated passwordResetToken duration",
  });
};
