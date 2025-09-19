import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { extractMessageFromPbError, toastMultiMessages } from "../utils/pbUtils";
import { updateAuthAlertEmailTemplate } from "./pbAuthAlertEmailTemplate";
import { Textarea } from "@/components/ui/textarea";

export const AuthAlertEmailTemplateForm = (p: {
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
          const resp = await updateAuthAlertEmailTemplate({
            pb,
            value: { subject: innerSubjectValue, body: innerBodyValue },
          });

          if (resp.success) return toast("template updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) toastMultiMessages(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="users-collection-authAlertEmailTemplateSubject-input">Subject</Label>
        <TextInput
          id="users-collection-authAlertEmailTemplateSubject-input"
          disabled={isLoading}
          value={innerSubjectValue}
          onInput={async (subject) => setInnerSubjectValue(subject)}
        />
      </div>
      <div>
        <Label htmlFor="users-collection-authAlertEmailTemplateBody-input">Body</Label>
        <Textarea
          id="users-collection-authAlertEmailTemplateBody-input"
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
