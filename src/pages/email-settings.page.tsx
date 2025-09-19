import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { EmailSettingsForm } from "@/modules/settings/forms/EmailSettingsForm";
import { TSettings, getSettings } from "@/modules/settings/pbSettings";
import { useEffect, useState } from "react";

const Page = () => {
  const [appSettings, setEmailSettings] = useState<TSettings>();

  useEffect(() => {
    (async () => {
      const resp = await getSettings({ pb });
      if (resp.success) setEmailSettings(resp.data);
    })();
  }, []);
  return (
    <MainLayout>
      {appSettings && (
        <div className="flex flex-col gap-4">
          <EmailSettingsForm
            pb={pb}
            appSettings={appSettings}
            onEmailSettingsUpdate={(x) => setEmailSettings(x)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
