import PocketBase from "pocketbase";
import { z } from "zod";

export { PocketBase };

export const checkPocketBaseUrlHealth = async (url: string) => {
  const schema = z.object({ status: z.number() });
  try {
    const initResp = await fetch(`${url}/api/health`);
    return schema.safeParse(initResp);
  } catch (error) {
    return { success: false, error } as const;
  }
};
