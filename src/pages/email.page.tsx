import { AccordionCard } from "@/components/AccordionCard";
import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { EmailVerificationTemplateForm } from "@/modules/EmailVerificationTemplate/emailVerificationTemplateForm";
import { ResetPasswordTemplateForm } from "@/modules/resetPasswordTemplate/ResetPasswordTemplateForm";
import {
  getUsersCollection,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { useEffect, useState } from "react";

const Page = () => {
  const [usersCollection, setUsersCollection] = useState<TUsersCollection>();

  useEffect(() => {
    (async () => {
      const resp = await getUsersCollection({ pb });
      if (resp.success) setUsersCollection(resp.data);
    })();
  }, []);

  return (
    <MainLayout>
      {usersCollection && (
        <div className="flex flex-col gap-4">
          <AccordionCard title="Email Verification Template" value="email-verification-template">
            <EmailVerificationTemplateForm
              pb={pb}
              subject={usersCollection.verificationTemplate.subject}
              body={usersCollection.verificationTemplate.body}
              onUsersCollectionUpdate={(x) => setUsersCollection(x)}
            />
          </AccordionCard>

          <AccordionCard title="Reset Password Template" value="reset-password-template">
            <ResetPasswordTemplateForm
              pb={pb}
              subject={usersCollection.resetPasswordTemplate.subject}
              body={usersCollection.resetPasswordTemplate.body}
              onUsersCollectionUpdate={(x) => setUsersCollection(x)}
            />
          </AccordionCard>
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
