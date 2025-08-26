import { PocketBase } from "@/config/pocketbaseConfig";
import { z } from "zod";

const collectionName = "users";
const usersCollectionSchema = z.object({
  created: z.string(),
  oauth2: z.object({
    enabled: z.boolean(),
    providers: z.array(
      z.object({
        clientId: z.string(),
        name: z.string(),
      }),
    ),
  }),
});

export type TUsersCollection = z.infer<typeof usersCollectionSchema>;
export type TOAuth2Provider = TUsersCollection["oauth2"]["providers"][number];
type TOAuth2ProviderSeed = Pick<TOAuth2Provider, "name" | "clientId"> & { clientSecret: string };

export const oAuth2ProviderNames = [
  "apple",
  "google",
  "microsoft",
  "yandex",
  "facebook",
  "instagram",
  "github",
  "gitlab",
  "bitbucket",
  "gitee",
  "gitea",
  "discord",
  "twitter",
  "kakao",
  "vk",
  "linear",
  "notion",
  "monday",
  "box",
  "spotify",
  "trakt",
  "twitch",
  "patreon",
  "strava",
  "wakatime",
  "livechat",
  "mailcow",
  "planningcenter",
  "oidc",
] as const;

export type TOAuth2ProviderName = (typeof oAuth2ProviderNames)[number];

export const enableOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { oauth2: { enabled: true } });
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const disableOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      oauth2: { enabled: false },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const addOAuth2Provider = async (p: {
  pb: PocketBase;
  provider: TOAuth2ProviderSeed;
  usersCollection: TUsersCollection;
}) => {
  const providers = p.usersCollection.oauth2.providers;
  const filteredProviders = providers.filter((x) => x.name !== p.provider.name);
  const newProviders = [...filteredProviders, p.provider];

  try {
    const collection = await p.pb.collections.update(collectionName, {
      oauth2: { providers: newProviders },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
export const removeOAuth2Provider = async (p: {
  pb: PocketBase;
  providerName: string;
  usersCollection: TUsersCollection;
}) => {
  const providers = p.usersCollection.oauth2.providers;
  const newProviders = providers.filter((x) => x.name !== p.providerName);
  try {
    const collection = await p.pb.collections.update(collectionName, {
      oauth2: { providers: newProviders },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};
