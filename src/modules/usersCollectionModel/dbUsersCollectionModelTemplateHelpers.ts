import { PocketBase } from "@/config/pocketbaseConfig";
import { TTemplate, updateUsersCollectionModel } from "./dbUsersCollectionModelHelpers";

export const updateAuthAlertEmailTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { authAlert: { emailTemplate: p.template } },
    successMessage: "Successfully updated authAlert email template",
    failMessage: "Failed to update authAlert email template",
  });
};

export const updateConfirmEmailChangeTemplate = async (p: {
  pb: PocketBase;
  template: TTemplate;
}) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { confirmEmailChangeTemplate: p.template },
    successMessage: "Successfully updated confirmEmailChangeTemplate",
    failMessage: "Failed to update confirmEmailChangeTemplate",
  });
};

export const updateEmailVerificationTemplate = async (p: {
  pb: PocketBase;
  template: TTemplate;
}) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { verificationTemplate: p.template },
    successMessage: "Successfully updated emailVerificationTemplate",
    failMessage: "Failed to update emailVerificationTemplate",
  });
};

export const updateOtpEmailTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { otp: { emailTemplate: p.template } },
    successMessage: "Successfully updated OTP email template",
    failMessage: "Failed to update OTP email template",
  });
};

export const updateResetPasswordTemplate = async (p: { pb: PocketBase; template: TTemplate }) => {
  return updateUsersCollectionModel({
    pb: p.pb,
    usersCollection: { resetPasswordTemplate: p.template },
    successMessage: "Successfully updated resetPasswordTemplate",
    failMessage: "Failed to update resetPasswordTemplate",
  });
};
