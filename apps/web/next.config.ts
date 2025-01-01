import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
