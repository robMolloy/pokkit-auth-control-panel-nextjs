import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { AppSettingsForm } from "@/modules/settings/AppSettingsForm";
import { getSettings, TSettings } from "@/modules/settings/pbSettings";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollectionModel/dbUsersCollectionModelHelpers";
import { EnableAuthAlertToggle } from "@/modules/usersCollectionModel/forms/EnableAuthAlertToggle";
import { useEffect, useState } from "react";

const Page = () => {
  const [settings, setSettings] = useState<TSettings>();
  const [usersCollection, setUsersCollection] = useState<TUsersCollection>();

  useEffect(() => {
    (async () => {
      const resp = await getSettings({ pb });
      if (resp.success) setSettings(resp.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const resp = await getUsersCollection({ pb });
      if (resp.success) setUsersCollection(resp.data);
    })();
  }, []);
  return (
    <MainLayout>
      {settings && (
        <AppSettingsForm
          pb={pb}
          appName={settings.meta.appName}
          appUrl={settings.meta.appURL}
          onSettingsUpdate={(x) => setSettings(x)}
        />
      )}
      {usersCollection && (
        <EnableAuthAlertToggle
          pb={pb}
          usersCollection={usersCollection}
          onUsersCollectionUpdate={(x) => setUsersCollection(x)}
        />
      )}
    </MainLayout>
  );
};

export default Page;
