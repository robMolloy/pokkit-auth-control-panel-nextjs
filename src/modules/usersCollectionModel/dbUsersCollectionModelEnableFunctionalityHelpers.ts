import { PocketBase } from "@/config/pocketbaseConfig";
import { updateUsersCollectionModel } from "./dbUsersCollectionModelHelpers";

export const enableAuthAlert = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { authAlert: { enabled: true } },
    successMessage: "Successfully enabled authAlert",
    failMessage: "Failed to enable authAlert",
  });
};

export const disableAuthAlert = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { authAlert: { enabled: false } },
    successMessage: "Successfully disabled authAlert",
    failMessage: "Failed to disable authAlert",
  });
};

export const enableOtp = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { otp: { enabled: true } },
    successMessage: "Successfully enabled OTP",
    failMessage: "Failed to enable OTP",
  });
};

export const disableOtp = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { otp: { enabled: false } },
    successMessage: "Successfully disabled OTP",
    failMessage: "Failed to disable OTP",
  });
};

export const enableMfa = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { mfa: { enabled: true } },
    successMessage: "Successfully enabled MFA",
    failMessage: "Failed to enable MFA",
  });
};

export const disableMfa = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { mfa: { enabled: false } },
    successMessage: "Successfully disabled MFA",
    failMessage: "Failed to disable MFA",
  });
};

export const enablePasswordAuth = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { passwordAuth: { enabled: true } },
    successMessage: "Successfully enabled passwordAuth",
    failMessage: "Failed to enable passwordAuth",
  });
};

export const disablePasswordAuth = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { passwordAuth: { enabled: false } },
    successMessage: "Successfully disabled passwordAuth",
    failMessage: "Failed to disable passwordAuth",
  });
};

export const enableOAuth2 = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: true } },
    successMessage: "Successfully enabled oAuth2",
    failMessage: "Failed to enable oAuth2",
  });
};

export const disableOAuth2 = async (p: { pb: PocketBase }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: false } },
    successMessage: "Successfully disabled oAuth2",
    failMessage: "Failed to disable oAuth2",
  });
};
