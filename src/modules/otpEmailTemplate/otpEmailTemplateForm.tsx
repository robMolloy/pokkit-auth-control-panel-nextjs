import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pb, PocketBase } from "@/config/pocketbaseConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TUsersCollection } from "../usersCollection/pbUsersCollectionHelpers";
import { extractMessageFromPbError, showMultipleErrorMessagesAsToast } from "../utils/pbUtils";
import { updateOtpEmailTemplate } from "./pbOtpEmailTemplate";
import { Textarea } from "@/components/ui/textarea";

export const OtpEmailTemplateForm = (p: {
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
          const resp = await updateOtpEmailTemplate({
            pb,
            value: { subject: innerSubjectValue, body: innerBodyValue },
          });

          if (resp.success) return toast("template updated successfully");

          const errorMessages = extractMessageFromPbError(resp);
          if (errorMessages) showMultipleErrorMessagesAsToast(errorMessages);
        })();

        setIsLoading(false);
      }}
    >
      <div>
        <Label htmlFor="users-collection-otpEmailTemplateSubject-input">Subject</Label>
        <TextInput
          id="users-collection-otpEmailTemplateSubject-input"
          disabled={isLoading}
          value={innerSubjectValue}
          onInput={async (subject) => setInnerSubjectValue(subject)}
        />
      </div>
      <div>
        <Label htmlFor="users-collection-otpEmailTemplateBody-input">Body</Label>
        <Textarea
          id="users-collection-otpEmailTemplateBody-input"
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
