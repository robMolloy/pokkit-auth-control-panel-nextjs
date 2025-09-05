import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
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
      {appSettings && <div className="flex flex-col gap-4">Loaded app settings</div>}
    </MainLayout>
  );
};

export default Page;
