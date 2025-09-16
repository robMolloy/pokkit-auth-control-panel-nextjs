import { useCurrentUserStore, useUnverifiedIsLoggedInStore } from "@/stores/authDataStore";

export const LogScreen = () => {
  const currentUserStore = useCurrentUserStore();
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();

  return (
    <div>
      <pre>{JSON.stringify({ currentUserStore, unverifiedIsLoggedInStore }, undefined, 2)}</pre>
    </div>
  );
};
