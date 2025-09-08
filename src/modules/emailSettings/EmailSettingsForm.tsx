import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractMessageFromPbError, showMultipleErrorMessagesAsToast } from "../utils/pbUtils";
import { TEmailSettings, updateEmailSettings } from "./pbEmailSettings";
import { Switch } from "@/components/ui/switch";

export const EmailSettingsForm = (p: {
  pb: PocketBase;
  emailSettings: TEmailSettings;
  onEmailSettingsUpdate: (x: TEmailSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerSenderName, setInnerSenderName] = useState(p.emailSettings.meta.senderName);
  const [innerSenderAddress, setInnerSenderAddress] = useState(p.emailSettings.meta.senderAddress);
  const [innerSmtpEnabled, setInnerSmtpEnabled] = useState(p.emailSettings.smtp.enabled);

  useEffect(() => {
    setInnerSenderName(p.emailSettings.meta.senderName);
    setInnerSenderAddress(p.emailSettings.meta.senderAddress);
    setInnerSmtpEnabled(p.emailSettings.smtp.enabled);
  }, [p.emailSettings]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateEmailSettings({
            pb,
            senderName: innerSenderName,
            senderAddress: innerSenderAddress,
            smtpEnabled: innerSmtpEnabled,
          });

          if (resp.success) {
            p.onEmailSettingsUpdate(resp.data);
            return toast("Email settings updated successfully");
          }

          const errorMessages = extractMessageFromPbError(resp);
          showMultipleErrorMessagesAsToast(errorMessages ?? ["something went wrong"]);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="emailSettings-senderName-input">Sender name</Label>
        <TextInput
          id="emailSettings-senderName-input"
          disabled={isLoading}
          value={innerSenderName}
          onInput={(senderName) => setInnerSenderName(senderName)}
        />
      </div>
      <div>
        <Label htmlFor="emailSettings-senderAddress-input">Sender address</Label>
        <TextInput
          id="emailSettings-senderAddress-input"
          disabled={isLoading}
          value={innerSenderAddress}
          onInput={(senderAddress) => setInnerSenderAddress(senderAddress)}
        />
      </div>
      <div>
        <Switch
          id="emailSettings-smtpEnabled-switch"
          disabled={isLoading}
          checked={innerSmtpEnabled}
          onCheckedChange={async () => setInnerSmtpEnabled((x) => !x)}
        />
        <Label htmlFor="emailSettings-smtpEnabled-switch">Enable SMTP</Label>
      </div>
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
