import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";
import { DeepPartial } from "../utils/typeUtils";

export const appSettingsSchema = z.object({
  meta: z.object({
    appName: z.string(),
    appURL: z.string(),
  }),
});

export type TAppSettings = z.infer<typeof appSettingsSchema>;
export type TAppSettingsUpdateSeed = DeepPartial<TAppSettings>;

export const getAppSettings = async (p: { pb: PocketBase }) => {
  try {
    const appSettings = await p.pb.settings.getAll();
    return appSettingsSchema.safeParse(appSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateAppSettings = async (p: {
  pb: PocketBase;
  appSettings: TAppSettingsUpdateSeed;
}) => {
  try {
    const appSettings = await p.pb.settings.update(p.appSettings);
    const parsedAppSettings = appSettingsSchema.parse(appSettings);
    const messages = ["Successfully updated app settings"];

    return { success: true, data: parsedAppSettings, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const fallback = "Unsuccessful update to app settings";
    const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

    return { success: false, error, messages } as const;
  }
};
