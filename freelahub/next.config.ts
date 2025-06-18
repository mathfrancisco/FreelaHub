import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'https://oovchlseucfmmflqitki.supabase.co',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            }
        ],
        formats: ['image/webp', 'image/avif'],
    },
    env: {
        CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;