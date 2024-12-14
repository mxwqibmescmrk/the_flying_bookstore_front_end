const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
/** @type {import('next').NextConfig} */
const nextConfig = {}
 
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
module.exports = withBundleAnalyzer(nextConfig)
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Fallback to false if you don't want to bundle `fs`
        path: false,
        os: false,
      };
    }
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ibb.co',
        port: '',
      },
      
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
      },
      
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        port: '',
      },
      
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
}