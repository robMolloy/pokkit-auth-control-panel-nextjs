import { LayoutTemplate } from "@/components/layout/LayoutTemplate";
import { Header } from "@/modules/Layout/Header";
import { LeftSidebar } from "@/modules/Layout/LeftSidebar";
import { PocketBaseScreen } from "@/modules/pocketBase/screens/PocketBaseScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { usePocketBaseStore } from "@/stores/pocketBaseStore";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const pocketBaseStore = usePocketBaseStore();
  const themeStore = useThemeStore();

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
          return <Component {...pageProps} />;
        })()}
      </LayoutTemplate>
    </>
  );
}
