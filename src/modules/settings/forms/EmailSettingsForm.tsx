import { Button } from "@/components/ui/button";
import { NumberInput, TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import { TSettings, updateEmailSettings } from "../dbSettings";

const SmtpServerTlsSelect = (p: { value: boolean; onValueChange: (x: boolean) => void }) => {
  const [value, setValue] = useState(p.value);
  const [textValue, setTextValue] = useState(p.value ? "true" : "false");

  useEffect(() => p.onValueChange(value), [value]);
  useEffect(() => setTextValue(p.value ? "true" : "false"), [p.value]);
  useEffect(() => setValue(textValue === "true"), [textValue]);

  return (
    <SimpleSelect
      value={textValue}
      onValueChange={(x) => setTextValue(x)}
      options={[
        { name: "Auto (StartTLS)", value: "false" },
        { name: "Always", value: "true" },
      ]}
      placeholder="Select an option"
    />
  );
};

export const EmailSettingsForm = (p: {
  pb: PocketBase;
  settings: TSettings;
  onEmailSettingsUpdate: (x: TSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [senderName, setSenderName] = useState(p.settings.meta.senderName);
  const [senderAddress, setSenderAddress] = useState(p.settings.meta.senderAddress);
  const [smtpEnabled, setSmtpEnabled] = useState(p.settings.smtp.enabled);
  const [smtpServerHost, setSmtpServerHost] = useState(p.settings.smtp.host);
  const [smtpServerPort, setSmtpServerPort] = useState(p.settings.smtp.port);
  const [smtpServerUsername, setSmtpServerUsername] = useState(p.settings.smtp.username);
  const [smtpServerPassword, setSmtpServerPassword] = useState("");
  const [smtpServerLocalName, setSmtpServerLocalName] = useState(p.settings.smtp.localName);
  const [smtpServerTls, setSmtpServerTls] = useState(p.settings.smtp.tls);
  const [smtpServerAuthMethod, setSmtpServerAuthMethod] = useState(p.settings.smtp.authMethod);

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
            senderName,
            senderAddress,
            smtpEnabled,
            smtpServerHost,
            smtpServerPort,
            smtpServerUsername,
            smtpServerPassword,
            smtpServerLocalName,
            smtpServerTls,
            smtpServerAuthMethod,
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
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverHost-input">Server Host</Label>
              <TextInput
                id="emailSettings-serverHost-input"
                disabled={isLoading}
                value={smtpServerHost}
                onInput={(serverHost) => setSmtpServerHost(serverHost)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverPort-input">Server Port</Label>
              <NumberInput
                id="emailSettings-serverPort-input"
                disabled={isLoading}
                value={smtpServerPort}
                onInput={(serverPort) => setSmtpServerPort(serverPort)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverUsername-input">Server Username</Label>
              <TextInput
                id="emailSettings-serverUsername-input"
                disabled={isLoading}
                value={smtpServerUsername}
                onInput={(serverUsername) => setSmtpServerUsername(serverUsername)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverPassword-input">Server Password</Label>
              <TextInput
                type="password"
                id="emailSettings-serverPassword-input"
                disabled={isLoading}
                value={smtpServerPassword}
                onInput={(serverPassword) => setSmtpServerPassword(serverPassword)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverLocalName-input">Server LocalName</Label>
              <TextInput
                id="emailSettings-serverLocalName-input"
                disabled={isLoading}
                value={smtpServerLocalName}
                onInput={(serverLocalName) => setSmtpServerLocalName(serverLocalName)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverTls-input">Server Tls</Label>
              <SmtpServerTlsSelect
                value={smtpServerTls}
                onValueChange={(x) => setSmtpServerTls(x)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="emailSettings-serverAuthMethod-select">Server AuthMethod</Label>
              <SimpleSelect
                value={smtpServerAuthMethod}
                onValueChange={(x) => setSmtpServerAuthMethod(x)}
                options={[
                  { name: "PLAIN", value: "PLAIN" },
                  { name: "LOGIN", value: "LOGIN" },
                ]}
                placeholder="Select an option"
              />
            </div>
          </div>
        </div>
      )}
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
