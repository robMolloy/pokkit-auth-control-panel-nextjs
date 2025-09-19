import { ConfirmationModalContent } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useModalStore } from "@/stores/modalStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TUsersCollection } from "../dbUsersCollectionModelHelpers";
import { updateEmailVerificationTokenDuration } from "../dbUsersCollectionModelTokenDurationHelpers";
import { invalidateEmailVerificationTokens } from "../dbUsersCollectionModelInvalidateTokensHelpers";

export const EmailVerificationTokenDurationInputForm = (p: {
  pb: PocketBase;
  value: number;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(p.value);

  const modalStore = useModalStore();

  useEffect(() => setValue(p.value), [p.value]);

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateEmailVerificationTokenDuration({ pb, duration: value });

          toastMultiMessages(resp.messages);
        })();

        setIsLoading(false);
      }}
    >
      <Label htmlFor="users-collection-emailVerificationTokenDuration-input">
        Email Verification Token Duration
      </Label>
      <span className="flex items-baseline gap-2">
        <NumberInput
          id="users-collection-emailVerificationTokenDuration-input"
          disabled={isLoading}
          value={value}
          onInput={async (e) => setValue(e)}
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
              onConfirm={() => invalidateEmailVerificationTokens({ pb })}
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
