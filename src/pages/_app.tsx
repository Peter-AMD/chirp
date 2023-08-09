import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Head>
        <title>Chirp Chirp</title>
        <meta content="🤷‍♀️" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
