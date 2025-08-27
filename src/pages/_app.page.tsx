import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { Toaster } from "@/components/ui/sonner";
import { pb } from "@/config/pocketbaseConfig";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
import { SuperuserAuthScreen } from "@/modules/superusers/SuperuserAuthScreen";
import { useInitAuth } from "@/modules/superusers/useInitAuth";

import { LoadingScreen } from "@/screens/LoadingScreen";
import { useCurrentUserStore } from "@/stores/authDataStore";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();
  const currentUserStore = useCurrentUserStore();

  themeStore.useThemeStoreSideEffect();

  useInitAuth({
    onIsLoading: () => {},
    onIsLoggedIn: () => {},
    onIsLoggedOut: () => {},
  });

  return (
    <>
      <Head>
        <title>pokkit auth control panel</title>
      </Head>
      <LayoutTemplate
        Header={<Header />}
        LeftSidebar={currentUserStore.data.authStatus === "loggedIn" && <LeftSidebar />}
      >
        <Toaster />
        {(() => {
          if (currentUserStore.data.authStatus === "loading") return <LoadingScreen />;

          if (currentUserStore.data.authStatus === "loggedOut")
            return <SuperuserAuthScreen pb={pb} />;

          // should not be required
          if (currentUserStore.data.authStatus !== "loggedIn") {
            console.error(`this line should never be hit`);
            return;
          }

          // if (currentUserStore.data.user.status === "pending") return <AwaitingApprovalScreen />;

          // if (currentUserStore.data.user.status === "blocked") return <BlockedScreen />;

          return <Component {...pageProps} />;
        })()}
      </LayoutTemplate>
    </>
  );
}
