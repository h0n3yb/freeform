/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: [process.env.AWS_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        bcrypt: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        constants: false,
      }
    }
    return config
  },
};

module.exports = nextConfig;
