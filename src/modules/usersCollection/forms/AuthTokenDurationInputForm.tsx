import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";

import { ConfirmationModalContent } from "@/components/Modal";
import {
  extractMessageFromPbError,
  showMultipleErrorMessagesAsToast,
} from "@/modules/utils/pbUtils";
import { useModalStore } from "@/stores/modalStore";
import Link from "next/link";
import { toast } from "sonner";
import {
  invalidateAuthTokens,
  TUsersCollection,
  updateAuthTokenDuration,
} from "../pbUsersCollectionHelpers";

export const AuthTokenDurationInputForm = (p: {
  pb: PocketBase;
  value: number;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerValue, setInnerValue] = useState(p.value);

  const modalStore = useModalStore();

  useEffect(() => setInnerValue(p.value), [p.value]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateAuthTokenDuration({ pb, value: innerValue });

          if (resp.success) return toast("token updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) showMultipleErrorMessagesAsToast(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <Label htmlFor="users-collection-authTokenDuration-input">Auth Token Duration</Label>
      <span className="flex items-baseline gap-2">
        <NumberInput
          id="users-collection-authTokenDuration-input"
          disabled={isLoading}
          value={innerValue}
          onInput={async (e) => setInnerValue(e)}
        />
        <Button type="submit">Submit</Button>
      </span>
      <Link
        href="#"
        onClick={() =>
          modalStore.setData(
            <ConfirmationModalContent
              title="Confirm token invalidation"
              description="This will invalidate all previously issued tokens"
              onConfirm={() => invalidateAuthTokens({ pb })}
            />,
          )
        }
        className="text-xs hover:underline"
      >
        Invalidate all previously issued tokens
      </Link>
    </form>
  );
};
