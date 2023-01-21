module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["api.dicebear.com", "www.dicebear.com"],
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
