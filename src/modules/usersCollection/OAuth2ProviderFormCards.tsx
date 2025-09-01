import { CustomIcon } from "@/components/CustomIcon";
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/ui/input";
import { PocketBase } from "@/config/pocketbaseConfig";
import {
  addOAuth2Provider,
  oAuth2ProviderNames,
  removeOAuth2Provider,
  TOAuth2Provider,
  TOAuth2ProviderName,
} from "@/modules/usersCollection/pbOAuth2";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useState } from "react";
import { OAuth2ProviderImage } from "./OAuth2ProviderImage";
import { TUsersCollection } from "./pbUsersCollectionHelpers";

export const OAuth2ProviderForm = (p: {
  pb: PocketBase;
  providerName: TOAuth2ProviderName;
  provider?: TOAuth2Provider;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  return (
    <form
      className="p-1"
      onSubmit={async (e) => {
        e.preventDefault();
        const resp = await addOAuth2Provider({
          pb: p.pb,
          provider: { name: p.providerName, clientId, clientSecret },
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
              const resp = await removeOAuth2Provider({
                pb: p.pb,
                providerName: p.providerName,
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
  );
};

export const OAuth2ProviderFormCard = (p: {
  pb: PocketBase;
  providerName: TOAuth2ProviderName;
  usersCollection: TUsersCollection;
  provider?: TOAuth2Provider;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const isEnabled = !!p.provider;
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full px-6">
          <AccordionItem value={p.providerName}>
            <AccordionTrigger className="flex justify-start gap-4">
              <OAuth2ProviderImage providerName={p.providerName} />
              <div className="flex flex-1 flex-col gap-2">
                <CardTitle className="flex gap-4">
                  {p.providerName}
                  {isEnabled && <CustomIcon iconName="CheckCircleIcon" size="md" color="green" />}
                </CardTitle>
                <div className="no-underline">
                  Click to edit the settings for this oAuth2 provider
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <OAuth2ProviderForm
                pb={p.pb}
                providerName={p.providerName}
                provider={p.usersCollection.oauth2.providers.find((x) => x.name === p.providerName)}
                usersCollection={p.usersCollection}
                onUsersCollectionUpdate={p.onUsersCollectionUpdate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export const OAuth2ProvidersFormCards = (p: {
  pb: PocketBase;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {oAuth2ProviderNames.map((x) => (
        <OAuth2ProviderFormCard
          key={x}
          pb={p.pb}
          providerName={x}
          provider={p.usersCollection.oauth2.providers.find((y) => y.name === x)}
          usersCollection={p.usersCollection}
          onUsersCollectionUpdate={(x) => p.onUsersCollectionUpdate(x)}
        />
      ))}
    </div>
  );
};
