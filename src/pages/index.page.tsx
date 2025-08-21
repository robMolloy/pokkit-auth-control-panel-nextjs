import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { pb } from "@/config/pocketbaseConfig";
import { OAuth2Providers } from "@/modules/usersCollection/OAuth2Providers";
import { EnableUsersCollectionOauth2Toggle } from "@/modules/usersCollection/EnableUsersCollectionOauth2Toggle";

import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { useEffect, useState } from "react";

import { siReact, siNextdotjs, siJavascript, SimpleIcon } from "simple-icons";
import { useThemeStore } from "@/stores/themeStore";

const BrandIcon = (p: { iconData: SimpleIcon; size: number }) => {
  const x = useThemeStore();
  console.log(`index.page.tsx:${/*LL*/ 33}`, { x });
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={p.size}
      height={p.size}
      fill={`#${p.iconData.hex === "000000" ? "ffffff" : p.iconData.hex}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{p.iconData.title}</title>
      <path d={p.iconData.path} />
    </svg>
  );
};

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
      <p className="text-muted-foreground">
        This is your dashboard. Start adding your content here.
      </p>
      <BrandIcon iconData={siReact} size={32} />
      <BrandIcon iconData={siNextdotjs} size={32} />
      <BrandIcon iconData={siJavascript} size={32} />

      {usersCollection && (
        <>
          <EnableUsersCollectionOauth2Toggle
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <br />
          <OAuth2Providers
            pb={pb}
            usersCollection={usersCollection}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
        </>
      )}
      <pre>{JSON.stringify(usersCollection?.oauth2.providers, undefined, 2)}</pre>
    </MainLayout>
  );
}
