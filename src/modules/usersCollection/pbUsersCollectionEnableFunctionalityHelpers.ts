import { PocketBase } from "@/config/pocketbaseConfig";
import { updateUsersCollection } from "./pbUsersCollectionHelpers";

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

export const enableOAuth2 = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: true } },
    successMessage: "Successfully enabled oAuth2",
  });
};

export const disableOAuth2 = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: false } },
    successMessage: "Successfully disabled oAuth2",
  });
};
