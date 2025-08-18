import { Layout } from "@/components/layout/Layout";
import { PocketBaseScreen } from "@/modules/pocketBase/screens/PocketBaseScreen";
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
        <title>pokkit Starter</title>
      </Head>
      <Layout>
        {(() => {
          if (pocketBaseStore.data === null) return <PocketBaseScreen />;
          return <Component {...pageProps} />;
        })()}
      </Layout>
    </>
  );
}
