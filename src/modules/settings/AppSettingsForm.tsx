import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toastMultiMessages } from "../utils/pbUtils";
import { TSettings, updateSettings as updateSettings } from "./dbSettings";

export const AppSettingsForm = (p: {
  pb: PocketBase;
  appName: string;
  appUrl: string;
  onSettingsUpdate: (x: TSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState(p.appName);
  const [appUrl, setAppUrl] = useState(p.appUrl);

  useEffect(() => setAppName(p.appName), [p.appName]);
  useEffect(() => setAppUrl(p.appUrl), [p.appUrl]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateSettings({
            pb,
            settings: { meta: { appName: appName, appURL: appUrl } },
            successMessage: "Successfully updated app settings",
            failMessage: "Failed to update app settings",
          });

          if (resp.success) p.onSettingsUpdate(resp.data);
          toastMultiMessages(resp.messages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="appSettings-appName-input">App name</Label>
        <TextInput
          id="appSettings-appName-input"
          disabled={isLoading}
          value={appName}
          onInput={(appName) => setAppName(appName)}
        />
      </div>
      <div>
        <Label htmlFor="appSettings-appUrl-input">App url</Label>
        <TextInput
          id="appSettings-appUrl-input"
          disabled={isLoading}
          value={appUrl}
          onInput={(appUrl) => setAppUrl(appUrl)}
        />
      </div>
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
