import { Button } from "@/components/ui/button";
import { NumberInput, TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import { TSettings, updateEmailSettings } from "../pbSettings";

export const EmailSettingsForm = (p: {
  pb: PocketBase;
  appSettings: TSettings;
  onEmailSettingsUpdate: (x: TSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [senderName, setSenderName] = useState(p.appSettings.meta.senderName);
  const [senderAddress, setSenderAddress] = useState(p.appSettings.meta.senderAddress);
  const [smtpEnabled, setSmtpEnabled] = useState(p.appSettings.smtp.enabled);
  const [smtpServerHost, setSmtpServerHost] = useState(p.appSettings.smtp.host);
  const [smtpServerPort, setSmtpServerPort] = useState(p.appSettings.smtp.port);
  const [smtpServerUsername, setSmtpServerUsername] = useState(p.appSettings.smtp.username);
  const [smtpServerPassword, setSmtpServerPassword] = useState("");
  const [smtpServerLocalName, setSmtpServerLocalName] = useState(p.appSettings.smtp.localName);
  const [smtpServerTls, setSmtpServerTls] = useState(p.appSettings.smtp.tls);
  const [smtpServerAuthMethod, setSmtpServerAuthMethod] = useState(p.appSettings.smtp.authMethod);

  useEffect(() => {
    setSenderName(p.appSettings.meta.senderName);
    setSenderAddress(p.appSettings.meta.senderAddress);
    setSmtpEnabled(p.appSettings.smtp.enabled);
  }, [p.appSettings]);

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
            senderName: senderName,
            senderAddress: senderAddress,
            smtpEnabled: smtpEnabled,
          });

          if (resp.success) p.onEmailSettingsUpdate(resp.data);
          toastMultiMessages(resp.messages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="emailSettings-senderName-input">Sender name</Label>
        <TextInput
          id="emailSettings-senderName-input"
          disabled={isLoading}
          value={senderName}
          onInput={(senderName) => setSenderName(senderName)}
        />
      </div>
      <div>
        <Label htmlFor="emailSettings-senderAddress-input">Sender address</Label>
        <TextInput
          id="emailSettings-senderAddress-input"
          disabled={isLoading}
          value={senderAddress}
          onInput={(senderAddress) => setSenderAddress(senderAddress)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="emailSettings-smtpEnabled-switch"
          disabled={isLoading}
          checked={smtpEnabled}
          onCheckedChange={async () => setSmtpEnabled((x) => !x)}
        />
        <Label htmlFor="emailSettings-smtpEnabled-switch">Enable SMTP</Label>
      </div>
      {smtpEnabled && (
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="emailSettings-serverHost-input">Server Host</Label>
            <TextInput
              id="emailSettings-serverHost-input"
              disabled={isLoading}
              value={smtpServerHost}
              onInput={(serverHost) => setSmtpServerHost(serverHost)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverPort-input">Server Port</Label>
            <NumberInput
              id="emailSettings-serverPort-input"
              disabled={isLoading}
              value={smtpServerPort}
              onInput={(serverPort) => setSmtpServerPort(serverPort)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverUsername-input">Server Username</Label>
            <TextInput
              id="emailSettings-serverUsername-input"
              disabled={isLoading}
              value={smtpServerUsername}
              onInput={(serverUsername) => setSmtpServerUsername(serverUsername)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverPassword-input">Server Password</Label>
            <TextInput
              type="password"
              id="emailSettings-serverPassword-input"
              disabled={isLoading}
              value={smtpServerPassword}
              onInput={(serverPassword) => setSmtpServerPassword(serverPassword)}
            />
          </div>
          <div>
            <Label htmlFor="emailSettings-serverLocalName-input">Server LocalName</Label>
            <TextInput
              id="emailSettings-serverLocalName-input"
              disabled={isLoading}
              value={smtpServerLocalName}
              onInput={(serverLocalName) => setSmtpServerLocalName(serverLocalName)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="emailSettings-serverTls-toggle"
              disabled={isLoading}
              checked={smtpServerTls}
              onCheckedChange={async () => setSmtpServerTls((x) => !x)}
            />
            <Label htmlFor="emailSettings-serverTls-input">Server Tls</Label>
          </div>
          <div>
            <Label htmlFor="emailSettings-serverAuthMethod-input">Server AuthMethod</Label>
            <TextInput
              id="emailSettings-serverAuthMethod-input"
              disabled={isLoading}
              value={smtpServerAuthMethod}
              onInput={(serverAuthMethod) => setSmtpServerAuthMethod(serverAuthMethod)}
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
