import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
import { useAuthSync, usePocketBaseStore } from "@/modules/pocketBase/pocketBaseStore";
import { PocketBaseScreen } from "@/modules/pocketBase/screens/PocketBaseScreen";
import { SuperUserAuthScreen } from "@/modules/superUserAuth/SuperUserAuthScreen";
import { useSuperUserAuthStore } from "@/modules/superUserAuth/useSuperUserAuthStore";
// import { SuperUserAuthScreen } from "@/modules/superUserAuth/SuperUserAuthScreen";
// import { useSuperUserAuthStore } from "@/modules/superUserAuth/useSuperUserAuthStore";
import { LoadingScreen } from "@/screens/LoadingScreen";

import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const pocketBaseStore = usePocketBaseStore();
  const superUserAuthStore = useSuperUserAuthStore();
  const themeStore = useThemeStore();
  useAuthSync();

  useEffect(() => {
    pocketBaseStore.init();
  }, []);

  themeStore.useThemeStoreSideEffect();

  return (
    <>
      <Head>
        <title>pokkit auth-control-panel</title>
      </Head>
      <LayoutTemplate Header={<Header />} LeftSidebar={<LeftSidebar />}>
        {(() => {
          if (pocketBaseStore.data === undefined) return <LoadingScreen />;
          if (pocketBaseStore.data === null) return <PocketBaseScreen />;
          if (!superUserAuthStore.data) return <SuperUserAuthScreen pb={pocketBaseStore.data} />;
          return <Component {...pageProps} />;
        })()}
      </LayoutTemplate>
    </>
  );
}
