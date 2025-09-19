import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../dbUsersCollectionModelHelpers";
import {
  disableAuthAlert,
  enableAuthAlert,
} from "../dbUsersCollectionModelEnableFunctionalityHelpers";

export const EnableAuthAlertToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(p.usersCollection);
  const isChecked = value.authAlert.enabled;

  useEffect(() => setValue(p.usersCollection), [p.usersCollection.authAlert.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(value), [value]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-authAlert-switch"
        disabled={isLoading}
        checked={value.authAlert.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp = await (isChecked
              ? disableAuthAlert({ pb: p.pb })
              : enableAuthAlert({ pb: p.pb }));

            if (resp.success) setValue(resp.data);

            toastMultiMessages(resp.messages);
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-authAlert-switch">Enable Auth Alert</Label>
    </span>
  );
};
