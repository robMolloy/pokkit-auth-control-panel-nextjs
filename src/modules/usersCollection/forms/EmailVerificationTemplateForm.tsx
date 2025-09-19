import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { useEffect, useState } from "react";
import { TUsersCollection, updateEmailVerificationTemplate } from "../pbUsersCollectionHelpers";

export const EmailVerificationTemplateForm = (p: {
  pb: PocketBase;
  body: string;
  subject: string;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [innerSubjectValue, setInnerSubjectValue] = useState(p.subject);
  const [innerBodyValue, setInnerBodyValue] = useState(p.body);

  useEffect(() => setInnerSubjectValue(p.subject), [p.subject]);
  useEffect(() => setInnerBodyValue(p.body), [p.body]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        await (async () => {
          const resp = await updateEmailVerificationTemplate({
            pb,
            template: { subject: innerSubjectValue, body: innerBodyValue },
          });

          toastMultiMessages(resp.messages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="users-collection-emailVerificationTemplateSubject-input">Subject</Label>
        <TextInput
          id="users-collection-emailVerificationTemplateSubject-input"
          disabled={isLoading}
          value={innerSubjectValue}
          onInput={async (subject) => setInnerSubjectValue(subject)}
        />
      </div>
      <div>
        <Label htmlFor="users-collection-emailVerificationTemplateBody-input">Body</Label>
        <Textarea
          id="users-collection-emailVerificationTemplateBody-input"
          disabled={isLoading}
          value={innerBodyValue}
          onInput={(body) => setInnerBodyValue(body)}
          rows={10}
        />
      </div>
      <span className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </span>
    </form>
  );
};
