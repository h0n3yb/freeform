/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { bcrypt: 'bcrypt' }];
    return config;
  },
};

module.exports = nextConfig;
