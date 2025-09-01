import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { disableOAuth2, enableOAuth2 } from "./pbOAuth2";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TUsersCollection } from "./pbUsersCollectionHelpers";
import { toast } from "sonner";

export const EnableOauth2Toggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.usersCollection);
  const isChecked = innerValue.oauth2.enabled;

  useEffect(() => setInnerValue(p.usersCollection), [p.usersCollection.oauth2.enabled]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-oauth2-switch"
        disabled={isLoading}
        checked={innerValue.oauth2.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);
          await (async () => {
            const resp = await (isChecked
              ? disableOAuth2({ pb: p.pb })
              : enableOAuth2({ pb: p.pb }));

            if (resp.success) return setInnerValue(resp.data);

            const [message1, ...messages] = resp.error.messages;

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
      <Label htmlFor="enable-users-collection-oauth2-switch">Enable oAuth2</Label>
    </span>
  );
};
