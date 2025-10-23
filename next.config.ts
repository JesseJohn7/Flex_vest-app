import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js'],
  }
};

export default nextConfig;