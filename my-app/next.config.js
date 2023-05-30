/** @type {import('next').NextConfig} */
const nextConfig = {
  //   webpack: (config, { isServer }) => {
  //     if (!isServer) {
  //       config.module.rules.push({
  //         test: /\.wasm$/,
  //         loaders: ["wasm-loader"],
  //       });
  //       return config;
  //     }
  //   },

  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
