import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { pb } from "@/config/pocketbaseConfig";
import { EnableOAuth2Toggle } from "@/modules/usersCollection/forms/EnableUsersCollectionOAuth2Toggle";
import { OAuth2ProvidersFormCards } from "@/modules/usersCollection/forms/OAuth2ProviderFormCards";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { useEffect, useState } from "react";

export default function Home() {
  const [usersCollection, setUsersCollection] = useState<TUsersCollection>();

  useEffect(() => {
    (async () => {
      const resp = await getUsersCollection({ pb });
      if (resp.success) setUsersCollection(resp.data);
    })();
  }, []);

  return (
    <MainLayout>
      <H1>oAuth2</H1>
      {usersCollection && (
        <>
          <EnableOAuth2Toggle
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <br />
          <OAuth2ProvidersFormCards
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
        </>
      )}
    </MainLayout>
  );
}
