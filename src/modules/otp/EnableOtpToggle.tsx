import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { toastMultiMessages } from "../utils/pbUtils";
import { disableOtp, enableOtp } from "./pbOtp";

export const EnableOtpToggle = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.usersCollection);
  const isChecked = innerValue.otp.enabled;

  useEffect(() => setInnerValue(p.usersCollection), [p.usersCollection.otp.enabled]);
  useEffect(() => p.onUsersCollectionUpdate(innerValue), [innerValue]);

  return (
    <span className="flex items-center gap-2">
      <Switch
        id="enable-users-collection-otp-switch"
        disabled={isLoading}
        checked={innerValue.otp.enabled}
        onCheckedChange={async () => {
          if (isLoading) return;
          setIsLoading(true);

          await (async () => {
            const resp = await (isChecked ? disableOtp({ pb: p.pb }) : enableOtp({ pb: p.pb }));

            if (resp.success) setInnerValue(resp.data);

            toastMultiMessages(
              resp.success
                ? [`Successfully ${!isChecked ? "enabled" : "disabled"} OTP`]
                : resp.error.messages,
            );
          })();

          setIsLoading(false);
        }}
      />
      <Label htmlFor="enable-users-collection-otp-switch">Enable OTP</Label>
    </span>
  );
};
