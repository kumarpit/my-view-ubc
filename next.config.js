/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'myviewubc.s3.us-west-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ]
  }
}

module.exports = nextConfig
