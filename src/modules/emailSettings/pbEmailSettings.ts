import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

export const emailSettingsSchema = z.object({
  meta: z.object({
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
  smtpEnabled: boolean;
}) => {
  try {
    const emailSettings = await p.pb.settings.update({
      meta: { senderName: p.senderName, senderAddress: p.senderAddress },
      smtp: { enabled: p.smtpEnabled },
    });
    return emailSettingsSchema.safeParse(emailSettings);
  } catch (error) {
    return { success: false, error } as const;
  }
};
