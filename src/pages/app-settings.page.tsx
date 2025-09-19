import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { AppSettingsForm } from "@/modules/appSettings/AppSettingsForm";
import { getAppSettings, TAppSettings } from "@/modules/appSettings/pbAppSettings";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollectionModel/dbUsersCollectionModelHelpers";
import { EnableAuthAlertToggle } from "@/modules/usersCollectionModel/forms/EnableAuthAlertToggle";
import { useEffect, useState } from "react";

const Page = () => {
  const [appSettings, setAppSettings] = useState<TAppSettings>();
  const [usersCollection, setUsersCollection] = useState<TUsersCollection>();

  useEffect(() => {
    (async () => {
      const resp = await getAppSettings({ pb });
      if (resp.success) setAppSettings(resp.data);
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
      {appSettings && (
        <AppSettingsForm
          pb={pb}
          appName={appSettings.meta.appName}
          appUrl={appSettings.meta.appURL}
          onAppSettingsUpdate={(x) => setAppSettings(x)}
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
