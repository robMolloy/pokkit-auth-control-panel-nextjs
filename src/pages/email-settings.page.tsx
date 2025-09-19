import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { EmailSettingsForm } from "@/modules/settings/forms/EmailSettingsForm";
import { TSettings, getSettings } from "@/modules/settings/dbSettings";
import { useEffect, useState } from "react";
import { H1 } from "@/components/ui/defaultComponents";

const Page = () => {
  const [settings, setSettings] = useState<TSettings>();

  useEffect(() => {
    (async () => {
      const resp = await getSettings({ pb });
      if (resp.success) setSettings(resp.data);
    })();
  }, []);
  return (
    <MainLayout>
      <H1>Email Settings</H1>
      <br />
      {settings && (
        <div className="flex flex-col gap-4">
          <EmailSettingsForm
            pb={pb}
            settings={settings}
            onEmailSettingsUpdate={(x) => setSettings(x)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
