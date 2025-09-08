import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

export const emailSettingsSchema = z.object({
  meta: z.object({
    senderName: z.string(),
    senderAddress: z.string(),
  }),
});

export type TEmailSettings = z.infer<typeof emailSettingsSchema>;

export const getEmailSettings = async (p: { pb: PocketBase }) => {
  try {
    const emailSettings = await p.pb.settings.getAll();
    return emailSettingsSchema.safeParse(emailSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const updateEmailSettings = async (p: {
  pb: PocketBase;
  senderName: string;
  senderAddress: string;
}) => {
  try {
    const emailSettings = await p.pb.settings.update({
      meta: { senderName: p.senderName, senderAddress: p.senderAddress },
    });
    return emailSettingsSchema.safeParse(emailSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};
