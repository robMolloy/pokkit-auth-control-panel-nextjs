import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { disableMfa, enableMfa } from "./pbMfa";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { toast } from "sonner";

export const EnableMfaToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.usersCollection);
  const isChecked = innerValue.mfa.enabled;

  useEffect(() => setInnerValue(p.usersCollection), [p.usersCollection.mfa.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(innerValue), [innerValue]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-mfa-switch"
        disabled={isLoading}
        checked={innerValue.mfa.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp1 = await disableMfa({ pb: p.pb });
            if (!resp1.success) {
              resp1.error;
            }

            const promise = isChecked ? disableMfa({ pb: p.pb }) : enableMfa({ pb: p.pb });

            const resp = await promise;
            if (resp.success) return setInnerValue(resp.data);

            const [message1, ...messages] = resp.error.messages;

            if (!resp.success)
              toast(message1, {
                description: (
                  <div>
                    {messages.map((message) => (
                      <div key={message}>{message}</div>
                    ))}
                  </div>
                ),
              });
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-mfa-switch">Enable MFA</Label>
    </span>
  );
};
