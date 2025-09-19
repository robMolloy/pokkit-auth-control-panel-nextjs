import { PocketBase } from "@/config/pocketbaseConfig";
import { TTemplate, updateUsersCollection } from "./pbUsersCollectionHelpers";

export const updateAuthAlertEmailTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authAlert: { emailTemplate: p.template } },
    successMessage: "Successfully updated authAlert email template",
  });
};

export const updateConfirmEmailChangeTemplate = async (p: {
  pb: PocketBase;
  template: TTemplate;
}) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { confirmEmailChangeTemplate: p.template },
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
