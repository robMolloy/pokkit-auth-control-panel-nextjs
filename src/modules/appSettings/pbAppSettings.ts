import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";
import { extractMessageFromPbError } from "../utils/pbUtils";

export const appSettingsSchema = z.object({
  meta: z.object({
    appName: z.string(),
    appURL: z.string(),
  }),
});

export type TAppSettings = z.infer<typeof appSettingsSchema>;

export const getAppSettings = async (p: { pb: PocketBase }) => {
  try {
    const appSettings = await p.pb.settings.getAll();
    return appSettingsSchema.safeParse(appSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateAppSettings = async (p: { pb: PocketBase; appName: string; appUrl: string }) => {
  try {
    const appSettings = await p.pb.settings.update({
      meta: { appName: p.appName, appURL: p.appUrl },
    });
    const parsedAppSettings = appSettingsSchema.parse(appSettings);
    return {
      success: true,
      data: parsedAppSettings,
      messages: ["App settings updated successfully"],
    } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    return {
      success: false,
      error: (() => {
        const fallback = "Update appSettings unsuccessful";
        const messages = !messagesResp || messagesResp?.length === 0 ? [fallback] : messagesResp;

        return { messages };
      })(),
    } as const;
  }
};
