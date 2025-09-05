import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

export const appSettingsSchema = z.object({
  meta: z.object({
    appName: z.string(),
  }),
});

export type TAppSettings = z.infer<typeof appSettingsSchema>;

export const getAppSettings = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.settings.getAll();
    return appSettingsSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
