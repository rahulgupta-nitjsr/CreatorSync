import nextBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
let nextConfig = {
    // Add any existing Next.js configurations here
    // e.g., reactStrictMode: true,
};

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig); 