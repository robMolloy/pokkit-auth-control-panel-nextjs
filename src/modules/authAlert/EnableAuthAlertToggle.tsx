import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { toastMultiMessages } from "../utils/pbUtils";
import { disableAuthAlert, enableAuthAlert } from "./pbAuthAlert";

export const EnableAuthAlertToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.usersCollection);
  const isChecked = innerValue.authAlert.enabled;

  useEffect(() => setInnerValue(p.usersCollection), [p.usersCollection.authAlert.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(innerValue), [innerValue]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-authAlert-switch"
        disabled={isLoading}
        checked={innerValue.authAlert.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp = await (isChecked
              ? disableAuthAlert({ pb: p.pb })
              : enableAuthAlert({ pb: p.pb }));

            if (resp.success) setInnerValue(resp.data);

            toastMultiMessages(
              resp.success
                ? [`Successfully ${!isChecked ? "enabled" : "disabled"} auth alert`]
                : resp.error.messages,
            );
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-authAlert-switch">Enable Auth Alert</Label>
    </span>
  );
};
