import { PocketBase } from "@/config/pocketbaseConfig";
import { TUsersCollection, updateUsersCollection } from "./pbUsersCollectionHelpers";

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
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: true } },
  });
};

export const disableOAuth2 = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { enabled: false } },
  });
};

export const addOAuth2Provider = async (p: {
  pb: PocketBase;
  provider: TOAuth2ProviderSeed;
  usersCollection: TUsersCollection;
}) => {
  const providers = p.usersCollection.oauth2.providers;
  const filteredProviders = providers.filter((x) => x.name !== p.provider.name);
  const newProviders = [...filteredProviders, p.provider];

  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { providers: newProviders } },
  });
};

export const removeOAuth2Provider = async (p: {
  pb: PocketBase;
  providerName: string;
  usersCollection: TUsersCollection;
}) => {
  const providers = p.usersCollection.oauth2.providers;
  const newProviders = providers.filter((x) => x.name !== p.providerName);

  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { oauth2: { providers: newProviders } },
  });
};
