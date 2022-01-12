import "reveal.js/dist/reveal.css";
import "suneditor/dist/css/suneditor.min.css";
import "nouislider/dist/nouislider.css";

import "../styles/globals.css";
import "../styles/reveal-overrides.css";
import "../styles/print-mode.css";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";

import "resize-observer-polyfill";

// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

import { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";

import { wrapper } from "../src/store";
import { init as initSentry } from "../src/lib/sentry";
import { stubTouchEvent } from "../src/lib/TouchEvent.stub";

initSentry();

// Need to make sure window.TouchEvent exists because @svg-drawing library uses it
stubTouchEvent();

function App({ Component, pageProps, err }: AppProps & { err?: Error }) {
  return (
    <>
      <DefaultSeo
        titleTemplate="Solar Proposal for %s"
        defaultTitle="Solar Energy Project"
        description="Your solar proposal created by Enerflo"
      />
      <Head>
        <link rel="icon" href={require("../public/favicon.ico")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <GoogleAnalytics />
      </Head>
      <Component {...pageProps} err={err} />
    </>
  );
}

export default wrapper.withRedux(App);

function GoogleAnalytics(): JSX.Element {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return (
      <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />{" "}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </>
    );
  }
  // For some reason NextJs doesn't handle null, or empty fragments in the <Head>
  return <meta></meta>;
}
