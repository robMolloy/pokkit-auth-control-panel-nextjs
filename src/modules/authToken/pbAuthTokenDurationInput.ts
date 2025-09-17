import { PocketBase } from "@/config/pocketbaseConfig";
import { generateToken } from "@/lib/utils";
import { updateUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";

export const updateAuthTokenDuration = async (p: { pb: PocketBase; value: number }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { duration: p.value } },
  });
};

export const invalidateAuthTokens = async (p: { pb: PocketBase }) => {
  return updateUsersCollection({
    pb: p.pb,
    usersCollection: { authToken: { secret: generateToken() } },
  });
};
