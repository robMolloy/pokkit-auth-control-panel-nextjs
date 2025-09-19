import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import {
  TUsersCollection,
  disablePasswordAuth,
  enablePasswordAuth,
} from "../pbUsersCollectionHelpers";

export const EnablePasswordAuthToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.usersCollection);
  const isChecked = innerValue.passwordAuth.enabled;

  useEffect(() => setInnerValue(p.usersCollection), [p.usersCollection.passwordAuth.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(innerValue), [innerValue]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-passwordAuth-switch"
        disabled={isLoading}
        checked={innerValue.passwordAuth.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp = await (isChecked
              ? disablePasswordAuth({ pb: p.pb })
              : enablePasswordAuth({ pb: p.pb }));
            if (resp.success) setInnerValue(resp.data);

            toastMultiMessages(resp.messages);
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-passwordAuth-switch">Enable Password Auth</Label>
    </span>
  );
};
