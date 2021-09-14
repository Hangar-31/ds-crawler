import GlobalStyled from '../styles/Global.styled';

import { ThemeProvider } from '@emotion/react';
import React from 'react';

import GoogleFonts from 'next-google-fonts';
import Head from 'next/head';
import '@hangar31/built-by-h31';

function MyApp({ Component, pageProps: { footer, seo = {}, ...pageProps } }) {
  const theme = {};

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyled theme={theme} />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,400;1,500;1,700&display=swap" />
      <Head>
        <meta
          name="description"
          content={seo.pageDescription || 'ds-crawler'}
        />
        <title>{seo.pageTitle || 'ds-crawler'}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        =
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
