/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to enable middleware
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 