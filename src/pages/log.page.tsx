import { useCurrentUserStore, useUnverifiedIsLoggedInStore } from "@/stores/authDataStore";

const LogPage = () => {
  const currentUserStore = useCurrentUserStore();
  const unverifiedIsLoggedInStore = useUnverifiedIsLoggedInStore();

  return (
    <div>
      <pre>{JSON.stringify({ currentUserStore, unverifiedIsLoggedInStore }, undefined, 2)}</pre>
    </div>
  );
};

export default LogPage;
