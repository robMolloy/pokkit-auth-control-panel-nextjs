import { Layout } from "@/components/layout/Layout";
import { useThemeStore } from "@/stores/themeStore";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const themeStore = useThemeStore();

  themeStore.useThemeStoreSideEffect();

  return (
    <>
      <Head>
        <title>pokkit Starter</title>
      </Head>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </>
  );
}
