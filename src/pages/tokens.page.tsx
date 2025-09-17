import { MainLayout } from "@/components/layout/LayoutTemplate";
import { H1 } from "@/components/ui/defaultComponents";
import { pb } from "@/config/pocketbaseConfig";
import { AuthTokenDurationInputForm } from "@/modules/usersCollection/forms/AuthTokenDurationInputForm";
import { EmailChangeTokenDurationInputForm } from "@/modules/usersCollection/forms/EmailChangeTokenDurationInputForm";
import { EmailVerificationTokenDurationInputForm } from "@/modules/usersCollection/forms/EmailVerificationTokenInputForm";
import { PasswordResetTokenDurationInputForm } from "@/modules/usersCollection/forms/PasswordResetTokenInputForm";
import { ProtectedFileAccessTokenDurationInputForm } from "@/modules/usersCollection/forms/ProtectedFileAccessTokenInputForm";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { useEffect, useState } from "react";

export default function Home() {
  const [usersCollection, setUsersCollection] = useState<TUsersCollection>();

  useEffect(() => {
    (async () => {
      const resp = await getUsersCollection({ pb });
      if (resp.success) setUsersCollection(resp.data);
    })();
  }, []);

  return (
    <MainLayout>
      <H1>Welcome to pokkit auth control panel</H1>
      <br />
      {usersCollection && (
        <div className="flex flex-col gap-4">
          <AuthTokenDurationInputForm
            pb={pb}
            value={usersCollection.authToken.duration}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <EmailChangeTokenDurationInputForm
            pb={pb}
            value={usersCollection.emailChangeToken.duration}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <PasswordResetTokenDurationInputForm
            pb={pb}
            value={usersCollection.passwordResetToken.duration}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <EmailVerificationTokenDurationInputForm
            pb={pb}
            value={usersCollection.verificationToken.duration}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
          <ProtectedFileAccessTokenDurationInputForm
            pb={pb}
            value={usersCollection.fileToken.duration}
            onUsersCollectionUpdate={(x) => setUsersCollection(x)}
          />
        </div>
      )}
    </MainLayout>
  );
}
