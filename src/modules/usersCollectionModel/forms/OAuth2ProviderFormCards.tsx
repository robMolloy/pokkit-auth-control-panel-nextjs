import { AccordionCard } from "@/components/AccordionCard";
import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { PocketBase } from "@/config/pocketbaseConfig";
import { useState } from "react";
import { TUsersCollection } from "../dbUsersCollectionModelHelpers";
import {
  TOAuth2ProviderName,
  TOAuth2Provider,
  addOAuth2Provider,
  removeOAuth2Provider,
  oAuth2ProviderNames,
} from "../dbUsersCollectionModelOAuth2Helpers";
import { toastMultiMessages } from "@/modules/utils/pbUtils";

const OAuth2ProviderImage = (p: { providerName: TOAuth2ProviderName }) => {
  const src = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/_/images/oauth2/${p.providerName}.svg`;
  return (
    <span className="inline-block rounded bg-primary p-1">
      <img src={src} alt={`${p.providerName} logo`} className="inline-block h-12 w-12" />
    </span>
  );
};

export const OAuth2ProviderForm = (p: {
  pb: PocketBase;
  providerName: TOAuth2ProviderName;
  provider?: TOAuth2Provider;
  usersCollection: TUsersCollection;
  onUsersCollectionUpdate: (x: TUsersCollection) => void;
}) => {
  const [clientId, setClientId] = useState(p.provider?.clientId ?? "");
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
        toastMultiMessages(resp.messages);
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
    <AccordionCard
      value={p.providerName}
      topLeft={<OAuth2ProviderImage providerName={p.providerName} />}
      title={
        <div className="flex gap-4">
          {p.providerName}
          {isEnabled && <CustomIcon iconName="CheckCircleIcon" size="md" color="green" />}
        </div>
      }
      subtitle={"Click to edit the settings for this oAuth2 provider"}
      children={
        <OAuth2ProviderForm
          pb={p.pb}
          providerName={p.providerName}
          provider={p.usersCollection.oauth2.providers.find((x) => x.name === p.providerName)}
          usersCollection={p.usersCollection}
          onUsersCollectionUpdate={p.onUsersCollectionUpdate}
        />
      }
    />
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
