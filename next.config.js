/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Production optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
