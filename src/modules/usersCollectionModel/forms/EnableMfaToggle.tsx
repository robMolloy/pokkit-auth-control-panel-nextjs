import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../dbUsersCollectionModelHelpers";
import { disableMfa, enableMfa } from "../dbUsersCollectionModelEnableFunctionalityHelpers";

export const EnableMfaToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(p.usersCollection);
  const isChecked = value.mfa.enabled;

  useEffect(() => setValue(p.usersCollection), [p.usersCollection.mfa.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(value), [value]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-mfa-switch"
        disabled={isLoading}
        checked={value.mfa.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp = await (isChecked ? disableMfa({ pb: p.pb }) : enableMfa({ pb: p.pb }));
            if (resp.success) setValue(resp.data);

            toastMultiMessages(resp.messages);
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-mfa-switch">Enable MFA</Label>
    </span>
  );
};
