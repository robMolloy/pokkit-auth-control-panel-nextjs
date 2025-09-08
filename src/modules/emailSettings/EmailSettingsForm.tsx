import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractMessageFromPbError, showMultipleErrorMessagesAsToast } from "../utils/pbUtils";
import { TEmailSettings, updateEmailSettings } from "./pbEmailSettings";

export const EmailSettingsForm = (p: {
  pb: PocketBase;
  senderName: string;
  senderAddress: string;
  onEmailSettingsUpdate: (x: TEmailSettings) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerSenderName, setInnerSenderName] = useState(p.senderName);
  const [innerSenderAddress, setInnerSenderAddress] = useState(p.senderAddress);

  useEffect(() => setInnerSenderName(p.senderName), [p.senderName]);
  useEffect(() => setInnerSenderAddress(p.senderAddress), [p.senderAddress]);

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
          });

          if (resp.success) {
            p.onEmailSettingsUpdate(resp.data);
            return toast("Email settings updated successfully");
          }

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) showMultipleErrorMessagesAsToast(errorMessages);
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
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
