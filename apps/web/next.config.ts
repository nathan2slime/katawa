import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true
  },
  output: 'standalone',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
