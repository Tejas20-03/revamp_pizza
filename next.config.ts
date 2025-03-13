import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["admin.broadwaypizza.com.pk", "services.broadwaypizza.com.pk","media.dodostatic.net"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
