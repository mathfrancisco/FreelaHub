import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['sharp']
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'your-supabase-project.supabase.co',
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
}

export default nextConfig;