import { AccordionCard } from "@/components/AccordionCard";
import { MainLayout } from "@/components/layout/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { EmailVerificationTemplateForm } from "@/modules/EmailVerificationTemplate/emailVerificationTemplateForm";
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
        <>
          <AccordionCard title="Email Verification Template" value="Email-Verification-Template">
            <EmailVerificationTemplateForm
              pb={pb}
              subject={usersCollection.verificationTemplate.subject}
              body={usersCollection.verificationTemplate.body}
              onUsersCollectionUpdate={(x) => setUsersCollection(x)}
            />
          </AccordionCard>
        </>
      )}
    </MainLayout>
  );
};

export default Page;
