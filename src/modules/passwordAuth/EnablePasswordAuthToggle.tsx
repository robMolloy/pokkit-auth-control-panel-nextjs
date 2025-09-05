import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { showMultipleErrorMessagesAsToast } from "../utils/pbUtils";
import { disablePasswordAuth, enablePasswordAuth } from "./pbPasswordAuth";

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

            if (resp.success) return setInnerValue(resp.data);

            showMultipleErrorMessagesAsToast(resp.error.messages);
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-passwordAuth-switch">Enable Password Auth</Label>
    </span>
  );
};
