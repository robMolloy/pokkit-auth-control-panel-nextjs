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
type TInitSettingsUpdateSeed = Omit<TSettings, "smtp"> & {
  smtp: TSettings["smtp"] & { password: string };
};
export type TSettingsUpdateSeed = DeepPartial<TInitSettingsUpdateSeed>;

export const getSettings = async (p: { pb: PocketBase }) => {
  try {
    const settings = await p.pb.settings.getAll();
    return settingsSchema.safeParse(settings);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateSettings = async (p: {
  pb: PocketBase;
  settings: TSettingsUpdateSeed;
  successMessage: string;
  failMessage: string;
}) => {
  try {
    const settings = await p.pb.settings.update(p.settings);
    const data = settingsSchema.parse(settings);
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
    settings: { meta: { appName: p.appName, appURL: p.appUrl } },
    successMessage: "Successfully updated app settings",
    failMessage: "Failed to update app settings",
  });
};

export const updateEmailSettings = async (p: {
  pb: PocketBase;
  senderName: string;
  senderAddress: string;
  smtpEnabled: boolean;
  smtpServerHost: string;
  smtpServerPort: number;
  smtpServerUsername: string;
  smtpServerPassword: string;
  smtpServerLocalName: string;
  smtpServerTls: boolean;
  smtpServerAuthMethod: string;
}) => {
  const {
    senderName,
    senderAddress,
    smtpEnabled,
    smtpServerHost,
    smtpServerPort,
    smtpServerUsername,
    smtpServerPassword,
    smtpServerTls,
    smtpServerLocalName,
    smtpServerAuthMethod,
  } = p;
  return updateSettings({
    pb: p.pb,
    settings: {
      meta: { senderName, senderAddress },
      smtp: {
        enabled: smtpEnabled,
        host: smtpServerHost,
        port: smtpServerPort,
        username: smtpServerUsername,
        password: smtpServerPassword,
        authMethod: smtpServerAuthMethod,
        localName: smtpServerLocalName,
        tls: smtpServerTls,
      },
    },
    successMessage: "Successfully updated email settings",
    failMessage: "Failed to update email settings",
  });
};
