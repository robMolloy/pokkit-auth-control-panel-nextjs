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
  onAppSettingsUpdate: (x: TAppSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerAppName, setInnerAppName] = useState(p.appName);

  useEffect(() => setInnerAppName(p.appName), [p.appName]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateAppSettings({ pb, appName: innerAppName });

          if (resp.success) return toast("App settings updated successfully");

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
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
