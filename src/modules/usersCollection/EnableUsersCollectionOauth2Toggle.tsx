import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import {
  disableUsersCollectionOAuth2,
  enableUsersCollectionOAuth2,
  TUsersCollection,
} from "./pbUsersCollectionHelpers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const EnableUsersCollectionOauth2Toggle = (p: {
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

          const promise = isChecked
            ? disableUsersCollectionOAuth2({ pb: p.pb })
            : enableUsersCollectionOAuth2({ pb: p.pb });

          const resp = await promise;
          if (resp.success) setInnerValue(resp.data);

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-oauth2-switch">Enable oauth2</Label>
    </span>
  );
};
