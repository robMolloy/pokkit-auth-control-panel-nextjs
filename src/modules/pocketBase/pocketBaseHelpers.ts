import PocketBase from "pocketbase";
import { z } from "zod";

export { PocketBase };

export const checkPocketBaseUrlHealth = async (url: string) => {
  const schema = z.object({ status: z.literal(200) });
  try {
    const initResp = await fetch(`${url}/api/health`);
    const parseResp = schema.safeParse(initResp);

    if (!parseResp.success) return { success: false, error: parseResp.error } as const;
    return { success: true, data: { url, pb: new PocketBase(url) } } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};
