import { NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TUsersCollection, updateEmailChangeTokenDuration } from "../pbUsersCollectionHelpers";
import {
  extractMessageFromPbError,
  showMultipleErrorMessagesAsToast,
} from "@/modules/utils/pbUtils";

export const EmailChangeTokenDurationInputForm = (p: {
  pb: PocketBase;
  value: number;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.value);

  useEffect(() => setInnerValue(p.value), [p.value]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateEmailChangeTokenDuration({ pb, value: innerValue });

          if (resp.success) return toast("token updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) showMultipleErrorMessagesAsToast(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <Label htmlFor="users-collection-emailChangeTokenDuration-input">
        Email Change Token Duration
      </Label>
      <span className="flex gap-2">
        <NumberInput
          id="users-collection-emailChangeTokenDuration-input"
          disabled={isLoading}
          value={innerValue}
          onInput={async (e) => setInnerValue(e)}
        />
        <Button type="submit">Submit</Button>
      </span>
      <Label>This invalidates all previous issued tokens</Label>
    </form>
  );
};
