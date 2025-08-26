import { TOAuth2ProviderName } from "./pbOAuth2";

export const OAuth2ProviderImage = (p: { providerName: TOAuth2ProviderName }) => {
  const src = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/_/images/oauth2/${p.providerName}.svg`;
  return (
    <span className="inline-block rounded bg-primary p-1">
      <img src={src} alt={`${p.providerName} logo`} className="inline-block h-12 w-12" />
    </span>
  );
};
