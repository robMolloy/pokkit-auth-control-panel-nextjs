import { PocketBase } from "@/config/pocketbaseConfig";
import { AuthCollectionModel } from "pocketbase";
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

type TOAuth2Provider = AuthCollectionModel["oauth2"]["providers"][number];
type TOAuth2ProviderSeed = Pick<TOAuth2Provider, "name" | "clientId" | "clientSecret">;

export type TUsersCollection = z.infer<typeof usersCollectionSchema>;

export const getUsersCollection = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.getOne(collectionName);
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const enableUsersCollectionOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, { oauth2: { enabled: true } });
    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const disableUsersCollectionOAuth2 = async (p: { pb: PocketBase }) => {
  try {
    const collection = await p.pb.collections.update(collectionName, {
      oauth2: { enabled: false },
    });

    return usersCollectionSchema.safeParse(collection);
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const addUsersCollectionOAuth2Provider = async (p: {
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
export const removeUsersCollectionOAuth2Provider = async (p: {
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
