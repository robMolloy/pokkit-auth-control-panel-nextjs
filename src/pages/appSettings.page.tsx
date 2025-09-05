import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { AppSettingsForm } from "@/modules/appSettings/AppSettingsForm";
import { getAppSettings, TAppSettings } from "@/modules/appSettings/pbAppSettings";
import { useEffect, useState } from "react";

const Page = () => {
  const [appSettings, setAppSettings] = useState<TAppSettings>();

  useEffect(() => {
    (async () => {
      const resp = await getAppSettings({ pb });
      if (resp.success) setAppSettings(resp.data);
    })();
  }, []);
  return (
    <MainLayout>
      {appSettings && (
        <div className="flex flex-col gap-4">
          <AppSettingsForm
            pb={pb}
            appName={appSettings.meta.appName}
            onAppSettingsUpdate={(x) => setAppSettings(x)}
          />
          <pre>{JSON.stringify({ appSettings }, undefined, 2)}</pre>
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
