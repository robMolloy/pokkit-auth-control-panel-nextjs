import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { pb } from "@/config/pocketbaseConfig";
import { EnableOauth2Toggle } from "@/modules/usersCollection/EnableUsersCollectionOauth2Toggle";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import Link from "next/link";
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
      <H1>Welcome to pokkit auth control panel</H1>
      <br />
      {usersCollection && (
        <>
          <div className="flex flex-col">
            <EnableOauth2Toggle
              pb={pb}
              usersCollection={usersCollection}
              onUsersCollectionUpdate={(x) => setUsersCollection(x)}
            />
            <Link href="/oauth2" className="hover:underline">
              Go to oAuth2
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
}
