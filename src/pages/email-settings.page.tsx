import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { EmailSettingsForm } from "@/modules/emailSettings/EmailSettingsForm";
import { getEmailSettings, TEmailSettings } from "@/modules/emailSettings/pbEmailSettings";
import { useEffect, useState } from "react";

const Page = () => {
  const [emailSettings, setEmailSettings] = useState<TEmailSettings>();

  useEffect(() => {
    (async () => {
      const resp = await getEmailSettings({ pb });
      if (resp.success) setEmailSettings(resp.data);
    })();
  }, []);
  return (
    <MainLayout>
      {emailSettings && (
        <div className="flex flex-col gap-4">
          <EmailSettingsForm
            pb={pb}
            emailSettings={emailSettings}
            onEmailSettingsUpdate={(x) => setEmailSettings(x)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
