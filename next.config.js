/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'imgix',
    domains: ['posterly.pages.dev'],
    minimumCacheTTL: 240,
    path:''
  },
  
}

module.exports = nextConfig
