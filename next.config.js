const isProd = process.env.NODE_ENV === 'production';
const withPWA = require('next-pwa');

const RollbarSourcemapPlugin = require('rollbar-sourcemap-webpack-plugin');
const withTM = require('next-transpile-modules')([]); // pass the modules you would like to see transpiled

// replace `<ROLLBAR_ACCESS_TOKEN>` with your Rollbar access token
const ROLLBAR_ACCESS_TOKEN = '9a914833d8314c2288c83cecf47ff885';

module.exports = withTM(
  withPWA({
    env: {
      ROLLBAR_ACCESS_TOKEN,
    },
    eslint: {
      // Warning: Dangerously allow production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {
      deviceSizes: [320, 420, 768, 1024, 1200, 1920],
      domains: ['ods-crawler.s3.amazonaws.com'],
      imageSizes: [],
    },

    productionBrowserSourceMaps: true,
    publicRuntimeConfig: {
      // Will be available on both server and client
      rollbarClientToken: '0abb0db1c3754daea5186c615636d91f', // Pass through env variables
    },
    pwa: {
      dest: 'public',
      disable: !isProd,
    },
    async redirects() {
      return [];
    },
    serverRuntimeConfig: {
      rollbarServerToken: ROLLBAR_ACCESS_TOKEN,
    },

    webpack: (config, { buildId, dev, webpack }) => {
      if (!dev) {
        // Generate a common `id` to be used when initializing Rollbar & when uploading the sourcemaps.
        // This could be any common value, as long as it is used in `_document.js` when initializing Rollbar.
        const codeVersion = JSON.stringify(buildId);
        config.plugins.push(
          new webpack.DefinePlugin({
            'process.env.NEXT_BUILD_ID': codeVersion,
          })
        );

        config.plugins.push(
          new RollbarSourcemapPlugin({
            accessToken: ROLLBAR_ACCESS_TOKEN,
            publicPath: 'https://ds-crawler-frontend.servers.hangar31.dev',
            version: codeVersion,
          })
        );
      }

      return config;
    },
    webpack5: true,
  })
);
