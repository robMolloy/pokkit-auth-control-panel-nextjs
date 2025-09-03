import { NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { Button } from "@/components/ui/button";
import { updateProtectedFileAccessTokenDuration } from "./pbProtectedFileAccessTokenInput";
import { extractMessageFromPbError, handlePbErrorMessages } from "../utils/pbUtils";
import { toast } from "sonner";

export const ProtectedFileAccessTokenDurationInputForm = (p: {
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
          const resp = await updateProtectedFileAccessTokenDuration({ pb, value: innerValue });

          if (resp.success) return toast("token updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) handlePbErrorMessages(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <Label htmlFor="users-collection-protectedFileAccessTokenDuration-input">
        Protected File Access Token Duration
      </Label>
      <span className="flex gap-2">
        <NumberInput
          id="users-collection-protectedFileAccessTokenDuration-input"
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
