import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uuid = () => crypto.randomUUID();

export const safeJsonParse = (p: unknown) => {
  try {
    return { success: true, data: JSON.parse(p as string) } as const;
  } catch (e) {
    return { success: false, error: "invalid json" } as const;
  }
};

export const delay = async (x: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), x);
  });
};

const base64UrlDecode = (str: string) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";

  try {
    return { success: true, data: JSON.parse(atob(str)) } as const;
  } catch (error) {
    return { success: false, error: "invalid json" } as const;
  }
};

export const decodeJwt = (jwt: string) => {
  const parts = jwt.split(".");

  if (!parts[0]) return { success: false, error: "invalid token - missing part0" } as const;
  if (!parts[1]) return { success: false, error: "invalid token - missing part1" } as const;

  const payloadSchema = z.object({
    exp: z.number(),
    // collectionId: z.string(),
    // id: z.string(),
    // type: z.string(),
    // refreshable: z.boolean(),
  });
  // .partial();

  try {
    const headerResp = base64UrlDecode(parts[0]);
    const payloadResp = base64UrlDecode(parts[1]);
    if (!headerResp.success)
      return { success: false, error: "invalid token - cannot decode header" } as const;
    if (!payloadResp.success)
      return { success: false, error: "invalid token - cannot decode payload" } as const;
    const parsedPayloadResp = payloadSchema.safeParse(payloadResp.data);

    if (!parsedPayloadResp.success)
      return { success: false, error: "invalid token - invalid payload" } as const;

    const data = {
      header: headerResp.data,
      payload: parsedPayloadResp.data,
      signature: parts[2],
    };
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const isJwtValid = (jwt: string) => {
  const decodeResponse = decodeJwt(jwt);
  if (!decodeResponse.success) return decodeResponse;

  const now = Math.floor(Date.now() / 1000);
  const success = decodeResponse.data.payload.exp > now;
  return { success } as const;
};

export const generateToken = () => {
  const suitableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const suitableCharsLength = suitableChars.length;

  const getRandomInt = () => Math.floor(Math.random() * Math.floor(suitableCharsLength));
  const getRandomChar = () => suitableChars[getRandomInt()];

  return [...Array(50)].map(() => getRandomChar()).join("");
};
