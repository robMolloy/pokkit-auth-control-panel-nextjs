import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { DeepPartial } from "../utils/typeUtils";

export const settingsSchema = z.object({
  meta: z.object({
    appName: z.string(),
    appURL: z.string(),
    senderName: z.string(),
    senderAddress: z.string(),
  }),
  smtp: z.object({
    enabled: z.boolean(),
    port: z.number(),
    host: z.string(),
    username: z.string(),
    authMethod: z.string(),
    tls: z.boolean(),
    localName: z.string(),
  }),
});

export type TSettings = z.infer<typeof settingsSchema>;
export type TSettingsUpdateSeed = DeepPartial<TSettings>;

export const getSettings = async (p: { pb: PocketBase }) => {
  try {
    const appSettings = await p.pb.settings.getAll();
    return settingsSchema.safeParse(appSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateSettings = async (p: {
  pb: PocketBase;
  appSettings: TSettingsUpdateSeed;
  successMessage: string;
  failMessage: string;
}) => {
  try {
    const appSettings = await p.pb.settings.update(p.appSettings);
    const data = settingsSchema.parse(appSettings);
    const messages = [p.successMessage];

    return { success: true, data, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = [p.failMessage, ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};

export const updateAppSettings = async (p: { pb: PocketBase; appName: string; appUrl: string }) => {
  return updateSettings({
    pb: p.pb,
    appSettings: { meta: { appName: p.appName, appURL: p.appUrl } },
    successMessage: "Successfully updated app settings",
    failMessage: "Failed to update app settings",
  });
};

export const updateEmailSettings = async (p: {
  pb: PocketBase;
  senderName: string;
  senderAddress: string;
  smtpEnabled: boolean;
}) => {
  return updateSettings({
    pb: p.pb,
    appSettings: {
      meta: { senderName: p.senderName, senderAddress: p.senderAddress },
      smtp: { enabled: p.smtpEnabled },
    },
    successMessage: "Successfully updated email settings",
    failMessage: "Failed to update email settings",
  });
};
