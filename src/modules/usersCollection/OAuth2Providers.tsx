import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { PocketBase } from "@/config/pocketbaseConfig";

import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  addUsersCollectionOAuth2Provider,
  removeUsersCollectionOAuth2Provider,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useState } from "react";
import { OAuth2ProviderImage, providerNames, TProviderName } from "./OAuth2ProviderImage";

export const OAuth2ProviderForm = (p: {
  pb: PocketBase;
  providerName: TProviderName;
  usersCollection: TUsersCollection;
  isEnabled: boolean;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full px-6">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex justify-start gap-4">
              <OAuth2ProviderImage providerName={p.providerName} />
              <div className="flex flex-1 flex-col">
                <CardTitle className="flex gap-4">
                  {p.providerName}
                  {p.isEnabled && (
                    <CustomIcon
                      iconName={"CheckCircleIcon"}
                      size={"md"}
                      color={p.isEnabled ? "green" : undefined}
                    />
                  )}
                </CardTitle>
                <div className="no-underline">
                  Click to edit the settings for this oAuth2 provider
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <form
                className="p-1"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const resp = await addUsersCollectionOAuth2Provider({
                    pb: p.pb,
                    provider: { name: p.providerName.toLowerCase(), clientId, clientSecret },
                    usersCollection: p.usersCollection,
                  });
                  if (resp.success) p.onUsersCollectionUpdate(resp.data);
                }}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor={`${p.providerName}-client-id-input`}>client id</label>
                    <TextInput
                      value={clientId}
                      onInput={(x) => setClientId(x)}
                      placeholder="enter client id"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${p.providerName}-client-secret-input`}>client secret</label>
                    <TextInput
                      value={clientSecret}
                      onInput={(x) => setClientSecret(x)}
                      placeholder="enter client secret"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Submit</Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const resp = await removeUsersCollectionOAuth2Provider({
                          pb: p.pb,
                          providerName: p.providerName.toLowerCase(),
                          usersCollection: p.usersCollection,
                        });
                        if (resp.success) p.onUsersCollectionUpdate(resp.data);
                      }}
                    >
                      <CustomIcon iconName="Trash2" size="lg" />
                    </Button>
                  </div>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export const OAuth2Providers = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {providerNames.map((x) => (
        <OAuth2ProviderForm
          key={x}
          pb={p.pb}
          providerName={x}
          isEnabled={p.usersCollection.oauth2.providers
            .map((y) => y.name.toLowerCase())
            .includes(x.toLowerCase())}
          usersCollection={p.usersCollection}
          onUsersCollectionUpdate={(x) => p.onUsersCollectionUpdate(x)}
        />
      ))}
    </div>
  );
};
