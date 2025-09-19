import { Button } from "@/components/ui/button";
import { NumberInput, TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractMessageFromPbError, toastMultiMessages } from "../utils/pbUtils";
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
  const [innerSmtpServerHost, setInnerSmtpServerHost] = useState(p.emailSettings.smtp.host);
  const [innerSmtpServerPort, setInnerSmtpServerPort] = useState(p.emailSettings.smtp.port);
  const [innerSmtpServerUsername, setInnerSmtpServerUsername] = useState(
    p.emailSettings.smtp.username,
  );
  const [innerSmtpServerPassword, setInnerSmtpServerPassword] = useState("");
  const [innerSmtpServerLocalName, setInnerSmtpServerLocalName] = useState(
    p.emailSettings.smtp.localName,
  );
  const [innerSmtpServerTls, setInnerSmtpServerTls] = useState(p.emailSettings.smtp.tls);
  const [innerSmtpServerAuthMethod, setInnerSmtpServerAuthMethod] = useState(
    p.emailSettings.smtp.authMethod,
  );

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
          toastMultiMessages(errorMessages ?? ["something went wrong"]);
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
      <div className="flex items-center gap-2">
        <Switch
          id="emailSettings-smtpEnabled-switch"
          disabled={isLoading}
          checked={innerSmtpEnabled}
          onCheckedChange={async () => setInnerSmtpEnabled((x) => !x)}
        />
        <Label htmlFor="emailSettings-smtpEnabled-switch">Enable SMTP</Label>
      </div>
      {innerSmtpEnabled && (
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="emailSettings-serverHost-input">Server Host</Label>
            <TextInput
              id="emailSettings-serverHost-input"
              disabled={isLoading}
              value={innerSmtpServerHost}
              onInput={(serverHost) => setInnerSmtpServerHost(serverHost)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverPort-input">Server Port</Label>
            <NumberInput
              id="emailSettings-serverPort-input"
              disabled={isLoading}
              value={innerSmtpServerPort}
              onInput={(serverPort) => setInnerSmtpServerPort(serverPort)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverUsername-input">Server Username</Label>
            <TextInput
              id="emailSettings-serverUsername-input"
              disabled={isLoading}
              value={innerSmtpServerUsername}
              onInput={(serverUsername) => setInnerSmtpServerUsername(serverUsername)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverPassword-input">Server Password</Label>
            <TextInput
              type="password"
              id="emailSettings-serverPassword-input"
              disabled={isLoading}
              value={innerSmtpServerPassword}
              onInput={(serverPassword) => setInnerSmtpServerPassword(serverPassword)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverLocalName-input">Server LocalName</Label>
            <TextInput
              id="emailSettings-serverLocalName-input"
              disabled={isLoading}
              value={innerSmtpServerLocalName}
              onInput={(serverLocalName) => setInnerSmtpServerLocalName(serverLocalName)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="emailSettings-serverTls-toggle"
              disabled={isLoading}
              checked={innerSmtpServerTls}
              onCheckedChange={async () => setInnerSmtpServerTls((x) => !x)}
            />
            <Label htmlFor="emailSettings-serverTls-input">Server Tls</Label>
          </div>
          <div>
            <Label htmlFor="emailSettings-serverAuthMethod-input">Server AuthMethod</Label>
            <TextInput
              id="emailSettings-serverAuthMethod-input"
              disabled={isLoading}
              value={innerSmtpServerAuthMethod}
              onInput={(serverAuthMethod) => setInnerSmtpServerAuthMethod(serverAuthMethod)}
            />
          </div>
        </div>
      )}
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
