import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { PocketBase } from "@/config/pocketbaseConfig";

import {
  addUsersCollectionOAuth2Provider,
  removeUsersCollectionOAuth2Provider,
  TUsersCollection,
} from "@/modules/usersCollection/pbUsersCollectionHelpers";
import { useState } from "react";
import { OAuth2ProviderImage, providerNames, TProviderName } from "./OAuth2ProviderImage";

export const OAuth2ProviderForm = (p: {
  pb: PocketBase;
  providerName: TProviderName;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  return (
    <form
      className="flex items-center gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const resp = await addUsersCollectionOAuth2Provider({
          pb: p.pb,
          provider: { name: p.providerName, clientId, clientSecret },
          usersCollection: p.usersCollection,
        });
        if (resp.success) p.onUsersCollectionUpdate(resp.data);
      }}
    >
      <div>
        <OAuth2ProviderImage providerName={p.providerName} />
      </div>
      <div>
        <label htmlFor={`${p.providerName}-client-id-input`}>client id</label>
        <TextInput value={clientId} onInput={(x) => setClientId(x)} placeholder="enter client id" />
      </div>
      <div>
        <label htmlFor={`${p.providerName}-client-secret-input`}>client secret</label>
        <TextInput
          value={clientSecret}
          onInput={(x) => setClientSecret(x)}
          placeholder="enter client secret"
        />
      </div>
      <Button type="submit">Submit</Button>
      <Button
        variant="destructive"
        onClick={async () => {
          const resp = await removeUsersCollectionOAuth2Provider({
            pb: p.pb,
            providerName: p.providerName,
            usersCollection: p.usersCollection,
          });
          if (resp.success) p.onUsersCollectionUpdate(resp.data);
        }}
      >
        <CustomIcon iconName="Trash2" size="lg" />
      </Button>
    </form>
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
          usersCollection={p.usersCollection}
          onUsersCollectionUpdate={(x) => p.onUsersCollectionUpdate(x)}
        />
      ))}
    </div>
  );
};
