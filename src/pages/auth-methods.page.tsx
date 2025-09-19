import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { pb } from "@/config/pocketbaseConfig";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollectionModel/dbUsersCollectionModelHelpers";
import { EnableMfaToggle } from "@/modules/usersCollectionModel/forms/EnableMfaToggle";
import { EnableOtpToggle } from "@/modules/usersCollectionModel/forms/EnableOtpToggle";
import { EnablePasswordAuthToggle } from "@/modules/usersCollectionModel/forms/EnablePasswordAuthToggle";
import { EnableOAuth2Toggle } from "@/modules/usersCollectionModel/forms/EnableUsersCollectionOAuth2Toggle";
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
      <H1>Auth Methods</H1>
      <br />
      {usersCollection && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <EnableOAuth2Toggle
              pb={pb}
              usersCollection={usersCollection}
              onUsersCollectionUpdate={(x) => setUsersCollection(x)}
            />
            <Link href="/oauth2" className="hover:underline">
              Go to oAuth2
            </Link>
          </div>
          <EnableMfaToggle
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <EnableOtpToggle
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <EnablePasswordAuthToggle
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
        </div>
      )}
    </MainLayout>
  );
}
