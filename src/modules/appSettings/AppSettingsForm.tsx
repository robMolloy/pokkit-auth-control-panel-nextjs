import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractMessageFromPbError, showMultipleErrorMessagesAsToast } from "../utils/pbUtils";
import { TAppSettings, updateAppSettings } from "./pbAppSettings";

export const AppSettingsForm = (p: {
  pb: PocketBase;
  appName: string;
  appUrl: string;
  onAppSettingsUpdate: (x: TAppSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerAppName, setInnerAppName] = useState(p.appName);
  const [innerAppUrl, setInnerAppUrl] = useState(p.appUrl);

  useEffect(() => setInnerAppName(p.appName), [p.appName]);
  useEffect(() => setInnerAppUrl(p.appUrl), [p.appUrl]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateAppSettings({ pb, appName: innerAppName, appUrl: innerAppUrl });

          if (resp.success) {
            p.onAppSettingsUpdate(resp.data);
            return toast("App settings updated successfully");
          }

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) showMultipleErrorMessagesAsToast(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="appSettings-appName-input">App name</Label>
        <TextInput
          id="appSettings-appName-input"
          disabled={isLoading}
          value={innerAppName}
          onInput={(appName) => setInnerAppName(appName)}
        />
      </div>
      <div>
        <Label htmlFor="appSettings-appUrl-input">App url</Label>
        <TextInput
          id="appSettings-appUrl-input"
          disabled={isLoading}
          value={innerAppUrl}
          onInput={(appUrl) => setInnerAppUrl(appUrl)}
        />
      </div>
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
