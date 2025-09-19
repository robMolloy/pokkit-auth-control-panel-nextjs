import { NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  invalidateFileAccessTokens,
  TUsersCollection,
  updateProtectedFileAccessTokenDuration,
} from "../pbUsersCollectionHelpers";
import { extractMessageFromPbError, toastMultiMessages } from "@/modules/utils/pbUtils";
import { ConfirmationModalContent } from "@/components/Modal";
import Link from "next/link";
import { useModalStore } from "@/stores/modalStore";

export const ProtectedFileAccessTokenDurationInputForm = (p: {
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
          const resp = await updateProtectedFileAccessTokenDuration({ pb, value: innerValue });

          if (resp.success) return toast("token updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) toastMultiMessages(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <Label htmlFor="users-collection-protectedFileAccessTokenDuration-input">
        Protected File Access Token Duration
      </Label>
      <span className="flex items-baseline gap-2">
        <NumberInput
          id="users-collection-protectedFileAccessTokenDuration-input"
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
              onConfirm={() => invalidateFileAccessTokens({ pb })}
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
