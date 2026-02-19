/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'secure.gravatar.com'], // Add your WordPress domain here later
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    transpilePackages: ['react-markdown', 'remark-gfm', 'rehype-raw'],
}

module.exports = nextConfig
