export const providerNames = [
  "Apple",
  "Google",
  "Microsoft",
  "Yandex",
  "Facebook",
  "Instagram",
  "Github",
  "Gitlab",
  "Bitbucket",
  "Gitee",
  "Gitea",
  "Discord",
  "Twitter",
  "Kakao",
  "Vk",
  "Linear",
  "Notion",
  "Monday",
  "Box",
  "Spotify",
  "Trakt",
  "Twitch",
  "Patreon",
  "Strava",
  "Wakatime",
  "Livechat",
  "Mailcow",
  "Planningcenter",
  "Oidc",
] as const;

export type TProviderName = (typeof providerNames)[number];

export const OAuth2ProviderImage = (p: { providerName: TProviderName }) => {
  const src = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/_/images/oauth2/${p.providerName.toLowerCase()}.svg`;
  return (
    <span className="inline-block rounded bg-primary p-1">
      <img src={src} alt={`${p.providerName} logo`} className="inline-block h-12 w-12" />
    </span>
  );
};
