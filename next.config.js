module.exports = {
  images: {
    domains: ["joeschmoe.io", "www.joeschmoe.io"],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
