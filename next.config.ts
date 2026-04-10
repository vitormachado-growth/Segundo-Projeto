import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // Necessário para roteamento correto no Cloudflare Pages
  images: {
    unoptimized: true, // Necessário com output: 'export'
  },
};

export default nextConfig;
